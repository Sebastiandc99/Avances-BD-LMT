"""Integration test for a real Chrome restart against the static deployment."""
import json
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import copytree, which
from tempfile import TemporaryDirectory
from threading import Thread

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


class StaticFiles(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Only the service worker may supply the offline shell. Isolate test data from Supabase.
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Security-Policy', "connect-src 'self'")
        super().end_headers()

    def log_message(self, *_):
        pass


@contextmanager
def chrome(profile, offline=False):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--window-size=1400,1000')
    options.add_argument(f'--user-data-dir={profile}')
    with webdriver.Chrome(service=Service(which('chromedriver')), options=options) as browser:
        if offline:
            browser.set_network_conditions(offline=True, latency=0, throughput=0)
        yield browser, WebDriverWait(browser, 20)


def open_vanos(browser, wait):
    # A fresh load always starts in Resumen, even when the saved tab was Vanos or Mapa.
    wait.until(lambda d: d.find_element(By.CSS_SELECTOR, '.cielo-nav button[aria-current="page"]').text == 'Resumen')
    browser.find_element(By.XPATH, '//button[normalize-space()="Vanos"]').click()


def check_restart(build, base):
    with TemporaryDirectory() as temporary:
        root = Path(temporary) / 'www'
        profile = Path(temporary) / 'chrome-profile'
        copytree(build, root / base)
        handler = partial(StaticFiles, directory=root)
        with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server:
            Thread(target=server.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{server.server_port}/{base}'
            try:
                with chrome(profile) as (browser, wait):
                    browser.get(url)
                    wait.until(lambda d: 'Listo para trabajar sin conexión' in d.find_element(By.TAG_NAME, 'footer').text)
            finally:
                server.shutdown()

        edit = 'button[aria-label="Editar vano 1 — 2"]'
        with chrome(profile, offline=True) as (browser, wait):
            browser.get(url)
            open_vanos(browser, wait)
            wait.until(lambda d: d.find_element(By.CSS_SELECTOR, edit)).click()
            assert browser.find_element(By.CSS_SELECTOR, '.hero-load').text == 'Cargar avances manualmente'
            browser.find_element(By.XPATH, '//button[normalize-space()="Terminado"]').click()
            browser.find_element(By.CSS_SELECTOR, '.form-footer button[type=submit]').click()
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)

        with chrome(profile, offline=True) as (browser, wait):
            browser.get(url)
            open_vanos(browser, wait)
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
            browser.find_element(By.XPATH, '//button[normalize-space()="Mapa"]').click()
            wait.until(lambda d: '235 vanos' in d.find_element(By.CSS_SELECTOR, '.panel-title').text)
        print(f'{build}: dos reinicios sin red, carga local persistente y mapa verificados.', flush=True)


def check_recovery(build, base):
    with TemporaryDirectory() as temporary:
        root = Path(temporary) / 'www'
        profile = Path(temporary) / 'chrome-profile'
        copytree(build, root / base)
        with ThreadingHTTPServer(('127.0.0.1', 0), partial(StaticFiles, directory=root)) as server:
            Thread(target=server.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{server.server_port}/{base}'
            try:
                with chrome(profile) as (browser, wait):
                    browser.get(url)
                    wait.until(lambda d: 'Listo para trabajar sin conexión' in d.find_element(By.TAG_NAME, 'footer').text)
                    open_vanos(browser, wait)
                    browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Editar vano 1 — 2"]').click()
                    browser.find_element(By.XPATH, '//button[normalize-space()="Terminado"]').click()
                    browser.find_element(By.CSS_SELECTOR, '.form-footer button[type=submit]').click()
                    wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
                    # Simulate a stale HTML shell referencing an unavailable script.
                    browser.execute_async_script('''
                        const done=arguments[arguments.length-1];
                        (async()=>{
                            const keys=await caches.keys();
                            for(const key of keys.filter(key=>key.startsWith('lmt-pages:'))){
                                const cache=await caches.open(key);
                                await cache.put(location.origin+location.pathname,new Response(
                                    '<!doctype html><div id="root"></div><script src="assets/missing-version.js"><\\/script>',
                                    {headers:{'Content-Type':'text/html'}}));
                            }
                        })().then(()=>done(true),error=>done(String(error)));
                    ''')
                    browser.refresh()
                    wait.until(lambda d: d.execute_script('return document.getElementById("root")?.childElementCount===0'))
                    browser.get(url + 'recuperar.html')
                    browser.find_element(By.ID, 'repair').click()
                    open_vanos(browser, wait)
                    wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
                    wait.until(lambda d: 'Listo para trabajar sin conexión' in d.find_element(By.TAG_NAME, 'footer').text)
            finally:
                server.shutdown()
        with chrome(profile, offline=True) as (browser, wait):
            browser.get(url)
            open_vanos(browser, wait)
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
        print(f'{build}: pantalla blanca recuperada, avance local conservado y nuevo reinicio sin red verificados.', flush=True)


def check_open_tab_update(build, base):
    with TemporaryDirectory() as temporary:
        root = Path(temporary) / 'www'
        profile = Path(temporary) / 'chrome-profile'
        site = root / base
        copytree(build, site)
        worker = (site / 'sw.js').read_text()
        config_line, worker_body = worker.split('\n', 1)
        config = json.loads(config_line.removeprefix('const BUILD = ').removesuffix(';'))
        entry = next(file for file in config['entryAssets'] if file.endswith('.js'))
        legacy_entry = 'assets/previous-entry.js'
        (site / entry).rename(site / legacy_entry)
        for field in ['files', 'entryAssets']:
            config[field] = [legacy_entry if file == entry else file for file in config[field]]
        config['version'] = 'previous-' + config['version']
        (site / 'sw.js').write_text('const BUILD = ' + json.dumps(config) + ';\n' + worker_body)
        (site / 'index.html').write_text((site / 'index.html').read_text().replace(
            base + entry, base + legacy_entry).replace('<title>Avances LMT</title>', '<title>Versión anterior de prueba</title>'))
        with ThreadingHTTPServer(('127.0.0.1', 0), partial(StaticFiles, directory=root)) as server:
            Thread(target=server.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{server.server_port}/{base}'
            try:
                with chrome(profile) as (browser, wait):
                    browser.get(url)
                    wait.until(lambda d: 'Listo para trabajar sin conexión' in d.find_element(By.TAG_NAME, 'footer').text)
                    open_vanos(browser, wait)
                    browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Editar vano 1 — 2"]').click()
                    browser.find_element(By.XPATH, '//button[normalize-space()="Terminado"]').click()
                    browser.find_element(By.CSS_SELECTOR, '.form-footer button[type=submit]').click()
                    wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
                    browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Editar vano 2 — 3"]').click()
                    browser.find_element(By.CSS_SELECTOR, 'textarea').send_keys('Borrador conservado durante la actualización')
                    copytree(build, site, dirs_exist_ok=True)
                    (site / legacy_entry).unlink()
                    browser.execute_async_script("""
                        const done=arguments[arguments.length-1];
                        navigator.serviceWorker.getRegistration().then(registration=>registration.update()).then(()=>done(true),error=>done(String(error)));
                    """)
                    update = wait.until(lambda d: d.find_element(By.XPATH, '//button[normalize-space()="Actualizar versión"]'))
                    assert browser.title == 'Versión anterior de prueba'
                    assert browser.find_element(By.CSS_SELECTOR, 'textarea').get_attribute('value') == 'Borrador conservado durante la actualización'
                    update.click()
                    wait.until(lambda d: 'Guardá o cerrá la carga' in d.find_element(By.CSS_SELECTOR, '[role=alertdialog]').text)
                    browser.find_element(By.XPATH, '//button[normalize-space()="Entendido"]').click()
                    browser.find_element(By.CSS_SELECTOR, '.form-footer button[type=submit]').click()
                    wait.until(lambda d: not d.find_elements(By.CSS_SELECTOR, '.form-footer button[type=submit]'))
                    browser.find_element(By.XPATH, '//button[normalize-space()="Actualizar versión"]').click()
                    wait.until(lambda d: d.title == 'Avances LMT')
                    open_vanos(browser, wait)
                    wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
                    browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Editar vano 2 — 3"]').click()
                    assert browser.find_element(By.CSS_SELECTOR, 'textarea').get_attribute('value') == 'Borrador conservado durante la actualización'
                    browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Cerrar ficha"]').click()
                    wait.until(lambda d: 'Listo para trabajar sin conexión' in d.find_element(By.TAG_NAME, 'footer').text)
            finally:
                server.shutdown()
        with chrome(profile, offline=True) as (browser, wait):
            browser.get(url)
            open_vanos(browser, wait)
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
        print(f'{build}: actualización con pestaña abierta, aviso, borrador protegido y reapertura offline verificados.', flush=True)


if __name__ == '__main__':
    check_restart('cloudflare-dist', '')
    check_restart('pages-dist', 'Avances-BD-LMT/')
    check_recovery('cloudflare-dist', '')
    check_recovery('pages-dist', 'Avances-BD-LMT/')
    check_open_tab_update('cloudflare-dist', '')
    check_open_tab_update('pages-dist', 'Avances-BD-LMT/')

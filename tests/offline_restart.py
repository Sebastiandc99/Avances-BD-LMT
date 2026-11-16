"""Integration test for a real Chrome restart against the static deployment."""
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
            wait.until(lambda d: d.find_element(By.CSS_SELECTOR, edit)).click()
            assert browser.find_element(By.CSS_SELECTOR, '.hero-load').text == 'Cargar avances manualmente'
            browser.find_element(By.XPATH, '//button[normalize-space()="Terminado"]').click()
            browser.find_element(By.CSS_SELECTOR, '.form-footer button[type=submit]').click()
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)

        with chrome(profile, offline=True) as (browser, wait):
            browser.get(url)
            wait.until(lambda d: 'Terminado' in d.find_element(By.CSS_SELECTOR, 'tbody tr').text)
            browser.find_element(By.XPATH, '//button[normalize-space()="Mapa"]').click()
            wait.until(lambda d: '235 vanos' in d.find_element(By.CSS_SELECTOR, '.panel-title').text)
        print(f'{build}: dos reinicios sin red, carga local persistente y mapa verificados.', flush=True)


if __name__ == '__main__':
    check_restart('cloudflare-dist', '')
    check_restart('pages-dist', 'Avances-BD-LMT/')

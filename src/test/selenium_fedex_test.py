#/usr/env/bin python
import webdriver_manager

from selenium.webdriver import Safari
from selenium.webdriver.safari.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
# from webdriver_manager.safari import SafariDriverManager

from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import datetime
import time
import os
import requests 
from selenium import webdriver
print("START TIME:")
print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


# chrome_options.add_argument('--headless')
# chrome_options.add_argument('--disable-gpu')

URL = "http://localhost:8080"
from selenium import webdriver

driver = Safari()
driver.implicitly_wait(2)
driver.set_window_size(1200, 1241)

driver.get(URL)

test1 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="Name"]')))
test1.send_keys("Immad")
time.sleep(0.5)

test2 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="address1"]')))
test2.send_keys("3242 Santa Susana Way")
time.sleep(0.5)

type3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "countries1")))
Select(type3).select_by_visible_text('United States')

test4 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="zip1"]')))
test4.send_keys("94587")
time.sleep(0.5)

type5 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "state1")))
Select(type5).select_by_visible_text('California')

test6 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="address2"]')))
test6.send_keys("1521 sherman street")
time.sleep(0.5)

type7 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "countries2")))
Select(type7).select_by_visible_text('United States')

test8 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="zip2"]')))
test8.send_keys("94501")
time.sleep(0.5)

type9 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "state2")))
Select(type9).select_by_visible_text('California')

test10 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="package_height"]')))
test10.send_keys("12")
time.sleep(0.5)

test10a = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//form[@id="user_info"]/div[11]/div[2]/button')))
test10a.click()
time.sleep(0.5)

test10b = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.LINK_TEXT, 'inch')))
test10b.click()
time.sleep(0.5)

test11 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="package_length"]')))
test11.send_keys("10")
time.sleep(0.5)

test11a = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//form[@id="user_info"]/div[12]/div[2]/button')))
test11a.click()
time.sleep(0.5)

test11b = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.LINK_TEXT, 'inch')))
test11b.click()
time.sleep(0.5)

test12 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="package_width"]')))
test12.send_keys("8")
time.sleep(0.5)


test12a = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//form[@id="user_info"]/div[13]/div[2]/button')))
test12a.click()
time.sleep(0.5)

test12b = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.LINK_TEXT, 'inch')))
test12b.click()
time.sleep(0.5)

test13 = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//input[@id="package_weight"]')))
test13.send_keys("10")
time.sleep(0.5)

test13a = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//form[@id="user_info"]/div[14]/div[2]/button')))
test13a.click()
time.sleep(0.5)

test13b = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.LINK_TEXT, 'lbs')))
test13b.click()
time.sleep(0.5)

residential_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "select_residential")))
residential_button.click()
time.sleep(0.5)

# Click Submit
submit_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "submit")))
submit_button.click()
time.sleep(0.5)


print(driver.page_source)

time.sleep(3000)
driver.quit()

print("END TIME:")
print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
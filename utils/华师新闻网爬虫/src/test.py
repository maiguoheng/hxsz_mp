import requests
from bs4 import BeautifulSoup

import io
from src.bmob import *
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')
s='123456798'
s='%s'%('ttt')+s
print(s)


# bmob=Bmob("bb577a4e1d6449c7fc6e8568d647e82d","e132ce46151fd8e7a9fa6fa28bd7edb2")
#  
# 
# source_web="http://news.scnu.edu.cn"
# 
# res = requests.get(source_web)
# soup=BeautifulSoup(res.text,'html.parser')
# 
# header = soup.select('.sect-newcnt')    
# 
# 
# # result=soup.find_all(class_='pure-u-1 pure-u-md-3-4')
# for link in header:
#     if(len(link.select('.nimg'))>0):
#         for res in link.select('.nimg'):
#             a=res.select('img')  
#             title_pic_url=source_web+a[0]['src'][0:len(a[0]['src'])-2]
#          
#             a = res.select('a')
#             href=source_web+a[0]['href']
#             title=a[0]['title']
#             
#             print()
#             print(title)
#             
# 
#             nimg_res = requests.get(href)
#             nimg_soup=BeautifulSoup(nimg_res.text,'html.parser')
#             text_content=""
# 
#             ss=nimg_soup.select('section')[0]
#             print(ss)
#             print(type(ss.get_text()))
#             print(ss.get_text().replace("class","r"))
#              

      
      
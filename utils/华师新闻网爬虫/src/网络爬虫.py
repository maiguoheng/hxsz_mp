import requests
from bs4 import BeautifulSoup

import io
from src.bmob import *
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')

bmob=Bmob("bb577a4e1d6449c7fc6e8568d647e82d","e132ce46151fd8e7a9fa6fa28bd7edb2")
 
 
bmob_smp=bmob.find( 
        "news_info", 
        BmobQuerier().addWhereEqualTo("type","title_no_pic")    
        ).queryResults
        
bmob_nimg=bmob.find( 
        "news_info", 
        BmobQuerier().addWhereEqualTo("type","title_have_pic")    
        ).queryResults


 
source_web="http://news.scnu.edu.cn"
res = requests.get(source_web)
soup=BeautifulSoup(res.text,'html.parser')

header = soup.select('.sect-newcnt')    


# result=soup.find_all(class_='pure-u-1 pure-u-md-3-4')
for link in header:
    if(len(link.select('.nimg'))>0):
        for res in link.select('.nimg'):
            a=res.select('img')  
            title_pic_url=source_web+a[0]['src'][0:len(a[0]['src'])-2]
         
            a = res.select('a')
            href=source_web+a[0]['href']
            title=a[0]['title']
            
            print()
            print(title)
            
            save_flag=True
            for r in bmob_nimg:
                if(r['title']==title):
                    save_flag=False
                    break
            if(save_flag==False):
                continue
            
            nimg_res = requests.get(href)
            nimg_soup=BeautifulSoup(nimg_res.text,'html.parser')
            text_content=""
    

            date=nimg_soup.select('.pdate >small')[0].text
            date=date[0:len(date)-9]

            for ss in nimg_soup.select('section')[0].select('p'):
                if (len(ss.select('img'))>0):
                    text_content=text_content+source_web+ss.select('img')[0]['src'][0:len(ss.select('img')[0]['src'])-2]+"@"
               
                if(len(ss.text)>0):
                    text_content=text_content+ss.text+"@"
            text_content=text_content.strip()
            
            text_content=text_content[0:len(text_content)-1]
            
            bmob.insert("news_info",{
                "info_source":source_web,
                "title":title,
                "date":date,
                "content":text_content.replace('&nbsp','').replace('nbsp',''),
                "type":"title_have_pic",
                "imgUrl":title_pic_url,        
                })      
     
          

    if(len(link.select('.smp'))>0):
        for res in link.select('.smp'):
            title=res.text
            
            print()
            print(title)
            
            save_flag=True
            for r in bmob_smp:
                if(r['title']==title):
                    save_flag=False
                    break
            if(save_flag==False):
                continue
            
            a = res.select('a')
            href=source_web+a[0]['href']
             
            smp_res = requests.get(href)
            smp_soup=BeautifulSoup(smp_res.text,'html.parser')
            text_content=""
            
            date=smp_soup.select('.pdate >small')[0].text
            date=date[0:len(date)-9]

            for ss in smp_soup.select('section')[0].select('p'):
                if (len(ss.select('img'))>0):
                    text_content=text_content+source_web+ss.select('img')[0]['src'][0:len(ss.select('img')[0]['src'])-2]+"@"
                if(len(ss.text)>0):
                    text_content="  "+text_content+ss.text+"@"
            text_content=text_content.strip()
            text_content=text_content[0:len(text_content)-1]
            
            bmob.insert("news_info",{
                "info_source":source_web,
                "title":title,
                "date":date,
                "content":text_content.replace('&nbsp', '').replace('nbs',''),
                "imgUrl":"http://bmob-cdn-24874.b0.upaiyun.com/2019/04/14/d27a0f2f4027c8c08017079cb7b9314a.jpg",
                "type":"title_no_pic",        
                })   
   
      



      
      
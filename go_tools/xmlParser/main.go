package main

import (
  "log"
  "encoding/xml"
)

type Urlset struct {
  XMLName		xml.Name 	`xml:"urlset"`
  Urls 			[]Url	 	`xml:"url"`
}

type Url struct {
  XMLName		xml.Name 	`xml:"url"`
//  Type 			string	 	`xml:"type,attr"`
  Loc			string 		`xml:"loc"`
  Changefreq 	string		`xml:"changefreq"`
  Priority 		string		`xml:"priority"`
  Lastmod 		string		`xml:"lastmod"`
}


func main() {
  logger("-- [start sitemap xml parser] --")

  xmlStr := `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://www.aaa.com/</loc>
		<priority>0.8</priority>
		<lastmod>2018-10-18T06:00+09:00</lastmod>
	</url>
	<url>
    <loc>https://www.bbb.com/</loc>
		<priority>0.8</priority>
		<lastmod>2018-10-18T06:00+09:00</lastmod>
	</url>
</urlset>
`

  var urls Urlset
  xml.Unmarshal([]byte(xmlStr), &urls)

  for i :=0; i < len(urls.Urls); i++ {
    logger(urls.Urls[i].Loc)
  }

  logger("-- [end sitemap xml parser] --")
}

func logger(msg string) {
  log.Println(": " , msg)
}

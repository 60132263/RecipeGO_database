# -*- coding: utf-8 -*-

import scrapy

from RecipeGO.items import RecipegoItem

class RecipegoSpider(scrapy.Spider):
    name = "RecipegoCrawler"

    def start_requests(self):
        for i in range(2, 1899, 1):
            yield scrapy.Request("http://www.menupan.com/Cook/recipeview.asp?cookid=%d" % i, self.parse_menupan)

    def parse_menupan(self, response):
        item = RecipegoItem()
        item['name'] = response.xpath('//div[@class="wrap_top"]/h2/text()').extract()[0]
        item['img'] = 'http://www.menupan.com' + response.xpath('//img[@class="img"]/@src').extract()[0]

        sel = response.xpath('//div[@class="infoTable"]/ul/li')

        item['amount'] = sel[0].xpath('dl/dd/text()').extract()[0]
        item['main'] = sel[1].xpath('dl/dd/a/text()').extract()
        item['main_a'] = sel[1].xpath('dl/dd/text()').extract()
        item['sub'] = sel[2].xpath('dl/dd/a/text()').extract()
        item['sub_a'] = sel[2].xpath('dl/dd/text()').extract()
        item['season'] = sel[3].xpath('dl/dd/a/text()').extract()
        item['season_a'] = sel[3].xpath('dl/dd/text()').extract()

        item['order'] = response.xpath('//dl[@class="recipePlus"]/dt/text()').extract()

        print '='*30
        print item['name']
        print item['img']
        print item['amount']
        print item['main'][1]
        print item['main_a'][1]
        print item['sub'][1]
        print item['sub_a'][1]
        print item['season'][1]
        print item['season_a'][1]
        print item['order'][0]

        yield item

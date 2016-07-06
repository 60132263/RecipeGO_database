# -*- coding: utf-8 -*-

import scrapy

class RecipegoItem(scrapy.Item):
    name = scrapy.Field()
    img = scrapy.Field()
    amount = scrapy.Field()
    main = scrapy.Field()
    main_a = scrapy.Field()
    sub = scrapy.Field()
    sub_a = scrapy.Field()
    season = scrapy.Field()
    season_a = scrapy.Field()
    order = scrapy.Field()
    pass

import csv

#get country list
f = open('data_1000.csv', 'rU')
reader = csv.reader(f, dialect=csv.excel_tab)
country_list = []
for row in reader:
	row_items = row[0].split(',')
	if row_items[0] not in country_list:
		country_list.append(row_items[0])
del country_list[0]
# print(country_list)


#create lang list
f_lang = open('lang.csv', 'rU')
reader_lang = csv.reader(f_lang, dialect=csv.excel_tab)
lang_list = []
lang_country_list = []
missing_lang_list = []
for row in reader_lang:
	row_items = row[0].split(',')
	lang_country_list.append(row_items[0])
	if row_items[0] in country_list:
		lang_list.append([row_items[0], row_items[1]])

del lang_country_list[0]
for items in country_list:
	if items not in lang_country_list:
		missing_lang_list.append(items)
# print(lang_list)
# print(lang_country_list)
# print(missing_lang_list)
# print(len(country_list))
# print(len(lang_list))
# print(len(missing_lang_list))


out = open('data_lang.txt', 'w')
out.write("country,lang\n")
for items in lang_list:
	out.write(items[0] +',' + items[1] + "\n")
for items in missing_lang_list:
	out.write(items+','+'\n')



#create region list
f_region = open('region.csv', 'rU')
reader_region = csv.reader(f_region, dialect=csv.excel_tab)
region_list = []
region_country_list=[]
missing_region_list=[]
for row in reader_region:
	row_items = row[0].split(',')
	region_country_list.append(row_items[0])
	if row_items[0] in country_list:
		region_list.append([row_items[0], row_items[1]])

del region_country_list[0]
for items in country_list:
	if items not in region_country_list:
		missing_region_list.append(items)
# print(region_list)
# print(len(region_list))
# print(region_country_list)
# print(missing_region_list)



out = open('data_region.txt', 'w')
out.write("country,region\n")
for items in region_list:
	out.write(items[0] +',' + items[1] + "\n")
for items in missing_region_list:
	out.write(items+','+'\n')


f.close()
f_lang.close()
f_region.close()
out.close()

#debug
# f = open('data_region.txt', 'r')
# counter = 0
# reader = f.readlines()
# for items in reader:
#  counter +=1
# print(counter)

# f = open('data_lang.txt', 'r')
# counter = 0
# reader = f.readlines()
# for items in reader:
#  counter +=1
# print(counter)

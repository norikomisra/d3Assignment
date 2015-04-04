# Data is stored in the following format
# sending, receiving, amount
# Afghanistan, Afghanistan, 0
# Afghanistan, Albania, 0


#read file and create a list
import csv
with open('remittance_matrix2012.csv', 'rU') as rf:
	spamreader = csv.reader(rf, dialect=csv.excel_tab)
	receiving_list = []
	sending_list = []
	amount_list = []
	final_list = []
	count = 0
	for row in spamreader:
		row_items = row[0].split(',')
		if count == 1:
			sending_list.extend(row_items)
			del sending_list[0]
			del sending_list[-1]
		if count >= 2:
			receiving_list.append(row_items[0])
			amount_list.append(row_items[1:len(row_items)-1])
		count =  count + 1
	del receiving_list[-8:]
	for x in range(len(sending_list)):
		for y in range(len(receiving_list)):
			if amount_list[x][y] != "": 
				final_list.append([sending_list[x], receiving_list[y], int(amount_list[x][y])])
			else:
				final_list.append([sending_list[x], receiving_list[y], amount_list[x][y]])

#create dictionary for both receiving and sending countries
import copy
receiving_dict={}
sending_dict={}
value_temp_sending = []
value_temp_receiving = []
counter = 0
for items in final_list:
	value_temp_sending.append([items[1], items[2]])
	counter +=1
	if counter == 213:
		counter -= 213
		sending_dict[items[0]]=copy.deepcopy(value_temp_sending)
		del value_temp_sending[:]

sorted_final_list = sorted(final_list, key=lambda x:x[1])
for items in sorted_final_list:
	value_temp_receiving.append([items[0], items[2]])
	counter +=1
	if counter == 213:
		counter -= 213
		receiving_dict[items[1]]=copy.deepcopy(value_temp_receiving)
		del value_temp_receiving[:]

#remove items below a threashold
def reduce_items(num):
	for key, value in receiving_dict.items():
		for items in value:
			if (items[1]=='') or (items[1]<num):




			
#write the list into a file
#three versions with all, <500, <1000
# with open('all_matrix2012.csv', 'wb') as wf:
# 	writer = csv.writer(wf)
 	
# with open('all_matrix2012.csv', 'wb') as wf:
# 	writer = csv.writer(wf)

# with open('all_matrix2012.csv', 'wb') as wf:
# 	writer = csv.writer(wf)










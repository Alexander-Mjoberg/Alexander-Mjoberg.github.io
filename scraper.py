# importing the libraries
from bs4 import BeautifulSoup
import requests

#Not all the programs, but most.
programs=['A', 'B', 'BI', 'BME', 'C', 'D', 'E', 'F', 'I', 'K', 'L', 'N', 'M', 'MD', 'V', 'W', 'Pi']

#Url for 19/20 Courses
url='https://kurser.lth.se/lot/?lasar=19_20&val=program&prog='
for program in programs:
	# Make a GET request to fetch the raw HTML content
	html_content = requests.get(url+program).content

	# Parse the html content
	soup = BeautifulSoup(html_content, "lxml")
	#print(soup.prettify()) # print the raw parsed data of html

	#Find all course tables using the HTML class that is currently used for those tables
	tb = soup.find_all('table', class_='CourseListView border hover lighter_table_head zebra')

	#Get the different grouping categories for the tables, i.e. year 1, specialization X..
	courseGrouping = []
	for headerText in soup.find_all('h3'):
		groupingName = headerText.text.replace('\n', ' ').strip()
		courseGrouping.append(groupingName)
		print(groupingName)

	#Find all the coursedata and store it in an array
	courseData = []
	i = 0
	for table in tb:
		for row in table.find_all('tr'):
			for cell in row.find_all('td'):
				name = cell.text.replace('\n', ' ').strip()
				courseData.append(name)
			courseData.append(courseGrouping[i])
			courseData.append('End of row')
		i += 1

	fileName='scraperData/html_data_'+program+'.txt'
	#Output to textfile
	with open(fileName, 'w') as filehandle:
	    for listitem in courseData:
	        filehandle.write('%s\n' % listitem)
# importing the libraries

#Not all the programs, but most.
programs=['A', 'B', 'BI', 'BME', 'C', 'D', 'E', 'F', 'I', 'K', 'L', 'N', 'M', 'MD', 'V', 'W', 'Pi']
with open('courseData/allSpecializations.txt', 'w', encoding="utf-8") as filehandler:
	filehandler.write('let programmes = ')
	filehandler.write('%s' % programs)
	filehandler.write('\n')
	filehandler.write('let specializationDict = {};\n')
	filehandler.close()

with open('courseData/allCourses.txt', 'w', encoding="utf-8") as filehandler:
	filehandler.write('let courseDict = {};\n')
	filehandler.close()

for program in programs:
	#Open and load the course data
	rawFilePath = "scraperData/html_data_" + program + ".txt"
	print(rawFilePath)
	rawCourseFile = open(rawFilePath,"r")
	text = rawCourseFile.read()
	rawCourseFile.close()

	#Split the text into table rows
	courses = text.split("End of row")

	courseCodes = []
	specializations = []
	coursesUnorganized = []
	#coursesUnorganized = ["(selected)","code","name","hp","level","lp1","lp2","lp3","lp4","specialization"]

	#Read course data from each row and add to the to the Unorganized list of coursedata
	for course in courses:
		courseValues = []
		lines = course.splitlines()
		nbrOfLines = len(lines)
		if (nbrOfLines < 7 ):  #Check that the course is not an empty list (header) or examensarbete
			pass
		elif (nbrOfLines == 15 and "Periodiserad" in lines[13]): #Find periodiserade kurser in specializations
			courseValues.append(lines[1]) #Code
			courseValues.append(lines[9]) #Name
			courseValues.append(lines[2].replace(',','.')) #Hp 
			courseValues.append(lines[3]) #level
			#Since periodiserad we can make all Lp false
			courseValues.append('false') #Lp1
			courseValues.append('false') #Lp2
			courseValues.append('false') #Lp3
			courseValues.append('false') #Lp4
			courseValues.append([lines[14].split(" - ")[1]]) # Specialization. Need to add safety for " - " appearing more than once in code
			coursesUnorganized.append(courseValues)
			courseCodes.append(lines[1]) #Code
			specializations.append(lines[14].split(" - ")[1]) # Specialization. Need to add safety for " - " appearing more than once in code
		elif (nbrOfLines == 14): #Electable courses paused (Valfria och periodiserade)
			#print(lines)
			courseValues.append(lines[1]) #Code
			courseValues.append(lines[8]) #Name
			courseValues.append(lines[2].replace(',','.')) #Hp
			courseValues.append(lines[3]) #level
			#Since periodiserad we can make all Lp false
			courseValues.append('false') #Lp1
			courseValues.append('false') #Lp2
			courseValues.append('false') #Lp3
			courseValues.append('false') #Lp4
			courseValues.append([lines[13].split(" - ")[0]]) # Specialization. Need to add safety for " - " appearing more than once in code
			coursesUnorganized.append(courseValues)
			courseCodes.append(lines[1]) #Code
			#specializations.append(lines[13].split(" - ")[0]) # Specialization. Need to add safety for " - " appearing more than once in code
		elif (nbrOfLines == 15): #Year 1-3 courses 
			courseValues.append(lines[1]) #Code
			courseValues.append(lines[6]) #Name
			courseValues.append(lines[2].replace(',','.')) #Hp
			courseValues.append(lines[3]) #level
			courseValues.append('true' if len(lines[10]) > 1 else 'false') # Lp1
			courseValues.append('true' if len(lines[11]) > 1 else 'false') # Lp2
			courseValues.append('true' if len(lines[12]) > 1 else 'false') # Lp3
			courseValues.append('true' if len(lines[13]) > 1 else 'false') # Lp4
			courseValues.append('basic')
			coursesUnorganized.append(courseValues)
			#courseCodes.append(lines[1]) # By not including the basic courses in the courseCode we can skip them in the export.
		elif (nbrOfLines == 17): #Electable courses (Valfria)
			#print(lines)
			courseValues.append(lines[1]) #Code
			courseValues.append(lines[8]) #Name
			courseValues.append(lines[2].replace(',','.')) #Hp
			courseValues.append(lines[3]) #level
			courseValues.append('true' if len(lines[12]) > 1 else 'false') # Lp1
			courseValues.append('true' if len(lines[13]) > 1 else 'false') # Lp2
			courseValues.append('true' if len(lines[14]) > 1 else 'false') # Lp3
			courseValues.append('true' if len(lines[15]) > 1 else 'false') # Lp4
			courseValues.append([lines[16].split(" - ")[0]]) # Specialization. Need to add safety for " - " appearing more than once in code
			coursesUnorganized.append(courseValues)
			courseCodes.append(lines[1]) #Code
			#specializations.append(lines[16].split(" - ")[0]) # Specialization. Need to add safety for " - " appearing more than once in code
		elif (nbrOfLines == 18): #Specialization courses
			#print(lines)
			courseValues.append(lines[1]) #Code
			courseValues.append(lines[9]) #Name
			courseValues.append(lines[2].replace(',','.')) #Hp
			courseValues.append(lines[3]) #level
			courseValues.append('true' if len(lines[13]) > 1 else 'false') # Lp1
			courseValues.append('true' if len(lines[14]) > 1 else 'false') # Lp2
			courseValues.append('true' if len(lines[15]) > 1 else 'false') # Lp3
			courseValues.append('true' if len(lines[16]) > 1 else 'false') # Lp4
			courseValues.append([lines[17].split(" - ")[1]]) # Specialization. Need to add safety for " - " appearing more than once in code
			coursesUnorganized.append(courseValues)
			courseCodes.append(lines[1]) #Code
			specializations.append(lines[17].split(" - ")[1]) # Specialization. Need to add safety for " - " appearing more than once in code
		else : #If some course doesn't match above template, generate a console log and canary in the coal mine entry for tracing. This will happen if LU changes page format.
			courseValues.append('ExceptionCanary')
			print('Exception raised, potentially one course did not register correctly. Printing line data')
			print(lines)
			print(len(lines))
	#150 codes in current selection with duplicates, 111 without

	#Create set of courses (unique, no duplicates)
	courseCodes = set(courseCodes) 
	specializations = list(set(specializations))
	specializations.sort()
	#Output to textfile
	with open('courseData/allSpecializations.txt', 'a', encoding="utf-8") as filehandler:
		filehandler.write('specializationDict[\'')
		filehandler.write('%s' % program)
		filehandler.write('\'] = ')
		filehandler.write('%s' % specializations)
		filehandler.write('\n')
		filehandler.close()

	specializations.append('Valfria kurser')
	specializations.append('Externt valfria kurser')

	# Roll up all the courses so each course have a single entry in the rollup list. 
	# This way the 4 different kinds of courses that exist are summarized in a single entry and rolled out for convenient front-end format later.
	# The 4 kinds of courses are:
	# Singular: Appears in a single specialization and is given once in the year.
	# Cross-specialization: Appears in several specializations. May be combined with recurring or paused.
	# Recurring: The same course available in several different semesters over the year.
	# Paused: Periodic course that is not given for the current year. 
	# 
	# Entries have the following form : [CourseCode, [CourseData], [Given in semesters]]
	#Initialize rollup
	courseRollup = []
	for code in courseCodes:
		courseRollup.append([code,"",""])

	for rollup in courseRollup:
		for course in coursesUnorganized:
			if rollup[0] == course[0] and course[8] != 'basic':  #If a course is not yet added to the rollup list, add it
				if rollup[1] == "" :
					rollup[1] = course  #Place coursedata on 2nd array slot
					rollup[2] = [course[4:8]] #Place available semester on 3rd array slot
				else:
					print(course)
					if course[8][0] in rollup[1][8]: #Add specialization if not already present in coursedata
						pass
					else:
						print(rollup[1])
						rollup[1][8].append(course[8][0])
					if course[4:8] in rollup[2]: #Add available semester if not already present in semesterData
						pass
					else:
						rollup[2].append(course[4:8])

	#Generate an organized list. Provide a ASC sorting order number based on which semester is available in. Split up recurring courses into several entries.
	coursesOrganized = []
	for rollup in courseRollup:
		if len(rollup[2]) == 1:
			booleans = [rollup[2][0][0]=='true', rollup[2][0][1]=='true', rollup[2][0][2]=='true', rollup[2][0][3]=='true']
			num=11
			orderCombinations = [[True,False,False,False],[True,True,False,False],[False,True,False,False],[False,True,True,False],[False,False,True,False],[False,False,True,True],[False,False,False,True],[False,False,False,False]]
			for i in range(0,7):
				if booleans==orderCombinations[i]:
					num=i
			rollup[1].append(num)
			coursesOrganized.append(rollup[1])
		else:
			print(">1")
			for i in range (0, len(rollup[2])):
				splitCourse = rollup[1].copy()
				splitCourse[4:8] = rollup[2][i]
				splitCourse[0]+='_'
				splitCourse[0]+=str(i)
				booleans = [splitCourse[4]=='true', splitCourse[5]=='true', splitCourse[6]=='true', splitCourse[7]=='true']
				num=11
				orderCombinations = [[True,False,False,False],[True,True,False,False],[False,True,False,False],[False,True,True,False],[False,False,True,False],[False,False,True,True],[False,False,False,True],[False,False,False,False]]
				for ic in range(0,7):
					if booleans==orderCombinations[ic]:
						num=ic
				splitCourse.append(num)
				coursesOrganized.append(splitCourse)


	#Output to textfile
	outputFilePath = 'courseData/courses' + program + '.txt'
	with open('courseData/allCourses.txt', 'a', encoding="utf-8") as filehandler:

		filehandler.write('\ncourseDict [\'')
		filehandler.write('%s' % program)
		filehandler.write('\'] = [')
		for listitem in coursesOrganized:
			filehandler.write('{\nselected:false,\ncode:\'')
			filehandler.write('%s' % listitem[0])
			filehandler.write('\',\nname:\'')
			filehandler.write('%s' % listitem[1])
			filehandler.write('\',\nhp:')
			filehandler.write('%s' % listitem[2])
			filehandler.write(',\nlevel:\'')
			filehandler.write('%s' % listitem[3])
			filehandler.write('\',\nlp1:')
			filehandler.write('%s' % listitem[4])
			filehandler.write(',\nlp2:')
			filehandler.write('%s' % listitem[5])
			filehandler.write(',\nlp3:')
			filehandler.write('%s' % listitem[6])
			filehandler.write(',\nlp4:')
			filehandler.write('%s' % listitem[7])
			filehandler.write(',\nspecialization:')
			filehandler.write('%s' % listitem[8])
			filehandler.write(',\nsortNo:')
			filehandler.write('%s' % listitem[9])
			filehandler.write(',\ndomRows:[]')
			filehandler.write(',\ndomCheckboxes:[]')
			filehandler.write('\n},\n')
		filehandler.write(']')
		filehandler.close()
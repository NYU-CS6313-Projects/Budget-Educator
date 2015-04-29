SELECT 
	geographical.`Location_Name` AS 'School Name',
	budget.`DBN` AS `DBN`,
	budget.`Total_Budget` AS `Budget`,
	demographics.`total_enrollment` AS `Total Enrollment`,
	(budget.`Total_Budget`/demographics.`total_enrollment` ) AS 'Budget Per Student',

	geographical.`Location_Type_Description` AS `School Type`,
	geographical.`Location_Category_Description` AS `School Category`,
	geographical.`Primary_Address` AS `Street Address`,
	geographical.`City` AS `City`,
	geographical.`State_Code` AS `State`,
	geographical.`Zip` AS `Zip Code`,
	geographical.`boroughCode` AS `Borough`,
	geographical.`latitude` AS `Latitude`,
	geographical.`longitude` AS `Longitude`,
	geographical.`loc` AS `Coordinates`,

	progress.`progress_report_type` AS `Report Type`,
	progress.`progress_report_grade` AS `Report Grade`,
	graduation_rates.`Total Cohort` AS `Number of Students in Cohort`, 
	graduation_rates.`Total Grads - % of cohort` AS `Percent of Graduation Students in Cohort`, 
	graduation_rates.`Total Regents - % of cohort` AS `Percent of Cohort Who Took Regents`, 
	graduation_rates.`Total Regents - % of grads` AS `Percent of Graduates Who Took Regents`, 
	graduation_rates.`Advanced Regents - % of cohort` AS `Percent of Cohort Who Took Advanced Regents`, 
	graduation_rates.`Advanced Regents - % of grads` AS `Percent of Graduates Who Took Advanced Regents`, 
	graduation_rates.`Regents without Advanced - % of cohort` AS `Percent of Cohort Who Took Regents Without Advanced`, 
	graduation_rates.`Regents without Advanced - % of grads` AS `Percent of Graduates Who Took Regents Without Advanced`, 
	graduation_rates.`Still Enrolled - % of cohort` AS `Percent of Cohort Who Are Still Enrolled`, 
	graduation_rates.`Dropped Out - % of cohort` AS `Percent of Cohort Who Dropped Out`,

	( (ela_scores.`Pct Level 1`) + (2*ela_scores.`Pct Level 2`) + (3*ela_scores.`Pct Level 3`) + (4*ela_scores.`Pct Level 4`) )/( (ela_scores.`Pct Level 1`) + (ela_scores.`Pct Level 2`) + (ela_scores.`Pct Level 3`) + (ela_scores.`Pct Level 4`) ) AS `ELA Mean Scale Score`, 
	ela_scores.`Pct Level 1` AS `Percent of Students Scoring Level 1 in ELA`, 
	ela_scores.`Pct Level 2` AS `Percent of Students Scoring Level 2 in ELA`, 
	ela_scores.`Pct Level 3` AS `Percent of Students Scoring Level 3 in ELA`, 
	ela_scores.`Pct Level 4` AS `Percent of Students Scoring Level 4 in ELA`,
	( (math_scores.`Pct Level 1`) + (2*math_scores.`Pct Level 2`) + (3*math_scores.`Pct Level 3`) + (4*math_scores.`Pct Level 4`) )/( (math_scores.`Pct Level 1`) + (math_scores.`Pct Level 2`) + (math_scores.`Pct Level 3`) + (math_scores.`Pct Level 4`) ) AS `Math Mean Scale Score`, 
	math_scores.`Pct Level 1` AS `Percent of Students Scoring Level 1 in Math`, 
	math_scores.`Pct Level 2` AS `Percent of Students Scoring Level 2 in Math`, 
	math_scores.`Pct Level 3` AS `Percent of Students Scoring Level 3 in Math`, 
	math_scores.`Pct Level 4` AS `Percent of Students Scoring Level 4 in Math`

FROM budget 
	INNER JOIN demographics on demographics.DBN=budget.DBN
	INNER JOIN geographical on geographical.DBN=budget.DBN
	LEFT JOIN progress ON progress.DBN=budget.DBN 
	LEFT JOIN graduation_rates on graduation_rates.DBN=budget.DBN
	LEFT JOIN ela_scores on ela_scores.DBN=budget.DBN
	LEFT JOIN math_scores on math_scores.DBN=budget.DBN

ORDER BY `School Name`
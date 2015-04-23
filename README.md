To Aarti and Tony:

Currently, each row on the school listing in the sidebar is given the id corresponding to their DBN and (the row) can be clicked on to 'select' the school. This is done by adding the class '.schoolSelected' to their respective row tag. To access all the schools currently selected, simply get all the elements with the class '.schoolSelected' via jQuery or whatnot. 

Similarly, for the dropdowns, selected 'li' elements are provided the class '.dropdownSelected' regardless of whether the dropdown is for the school types or the y-axis. In this case, you want to identify by the id of the dropdown first and then the 'li' elements with the '.dropdownSelected' class. 

Reminder that for the Y-Axis, only one may be selected.
Reminder for the school types, multiple may be selected.

Recall that, in the meeting, the scatterplot is to have, for its x-axis, the school budgets per student and it's y-axis interchangable. On this interface, the scatterplot is located in the center.

Recall also that the map view is to the right and it should show the map with all those school nodes that were highlighted or selected as coordinates in the map, with information that has yet to be discussed (he, at the time, just wanted it mapped).

I've already have the columns, by bootstrap, allocated for you and identified with '#scatterplot' and '#map'.
module.exports = {
  colourList: ['#9B30FF', '#0000FF', '#87CEFA', '#1100DD', '#990055', '#FFFF00', '#FFA500', '#660088','#008000', '#550099', '#4400AA', '#DC143C', '#2200CC'],
  abbreviatedProvince:
    Alberta : "AB",
    'British Columbia' : "BC",
    Saskatchewan : "SK",
    Manitoba : "MB",
    Ontario : "ON",
    Quebec : "QC",
    'New Brunswick' : "NB",
    'Newfoundland and Labrador' : "NL",
    'Nova Scotia': "NS",
    'Prince Edward Island': "PE",
    Yukon: "YT",
    'Northwest Territories' : "NT",
    Nunavut : "NU"
  
  groupAndSum: (array, key, sumBy) ->
    groupedObj = {}
    objectByYear = {}
    for row in array
      group = row[key]
      sumByIndex = row[sumBy]
      if !(groupedObj[group])
        groupedObj[group] = {}
      if !(groupedObj[group][sumByIndex])
        groupedObj[group][sumByIndex] = row
        groupedObj[group][sumByIndex].region = "Canada"
      else
        groupedObj[group][sumByIndex].value += row.value
    for type of groupedObj
      objectByYear[type]=
        present : true 
        values : []
      for year of groupedObj[type]
        objectByYear[type].values.push(groupedObj[type][year])
    objectByYear
  
  # get only elements in the array where array[field] == value; or all if value == null
  getFiltered: (array, field, value) ->
    filtered = []
    if !(value?)
      for element in array
        if field element then filtered.push element
    else 
      for element in array
        if element[field] == value
          filtered.push element 
    filtered

  # Apply a set of filters from an array
  applyFilters: (array, filters) ->
    filteredArray = []
    filterKeys = Object.keys filters 
    # If it is called without an array, or an empty object for filters, simply return the original
    if Object.prototype.toString.call(filters) != "[object Object]" || filterKeys.length < 1 
      return array
    else 
      for element in array
        toPush = true
        for key in filterKeys
          if(element[key] != undefined && element[key] != filters[key] && filters[key] != undefined)
            toPush = false
        if toPush == true
          filteredArray.push element
    filteredArray

  # Get unique identifiers for field
  getUnique: (array, field, ignore = []) ->
    unique = {}
    keys = []
    for element in array
      if unique[element[field]] == undefined and (element[field] not in ignore)
        unique[element[field]] = 0
        keys.push(element[field])
    keys

  # Serialize data
  getGrouped: (array, field) ->
    groups = {}
    keys = @getUnique array, field
    if (keys.length > 13) then keys.pop() #sassy fix for getting rid of Canada 
    for key in keys
      groupArray = @getFiltered array, field, key
      groups[key] = 
        values : groupArray
        present : true
    groups

  buildBubbleObject: (array, parentField, valueField, nameField, ignore = []) ->
    childrenKeys = {}
    bubbleObj = 
      name: "Canada"
      children: []
    for element in array
      if childrenKeys[element[parentField]] == undefined 
        childrenKeys[element[parentField]] = bubbleObj.children.length #Save the index for easy access later
        bubbleObj.children.push(
          name: element[parentField]
          children: []
        )
      if element[nameField] not in ignore 
        bubbleObj.children[childrenKeys[element[parentField]]].children.push(
          name: element[nameField]
          size: element[valueField]
        )
    bubbleObj
}

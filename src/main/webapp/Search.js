function searchHUNI(matchval) {
	if (matchval == null || matchval == "") {
		return;
	}
	
	if (matchval.indexOf(" ") != -1) {
		var split = matchval.split(" ");
		matchval = "";
		for (var i = 0; i < split.length; i++) {
			matchval += split[i];
			if (i < (split.length - 1)) {
				matchval += "%20AND%20";
			}
		}
	}
	
	var queryURL = "http://huni.esrc.unimelb.edu.au/solr/huni/select?q=(text:" 
		+ matchval + "%20OR%20text_rev:" + matchval + ")&rows=999999&wt=json" 
   	
    var oThis = this;
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    
    gadgets.io.makeRequest(queryURL, function(response){
	   	
    	var docs = response.data.response.docs;
    	
    	var recordData = [];
		
    	for (var i = 0; i < docs.length; i++) {  
        	var doc = docs[i];
        	        	
        	if (doc.date_begin) {
        		var json_object = {uri : doc.prov_source};
        		
        		if (doc.name) {
        			json_object["name"] = doc.name;
            	} else if (doc.title) {
            		json_object["name"] = doc.title[0];
            	} else if (doc.family_name && doc.given_name) {
            		json_object["name"] = doc.given_name + " " + doc.family_name;
            	} else if (doc.family_name) {
            		json_object["name"] = doc.family_name;
            	} else if (doc.given_name) {
            		json_object["name"] = doc.given_name;
            	}
        		
        		if (doc.date_begin) {
	 				json_object["startDate"] = doc.date_begin;
	 			}
	 			if (doc.date_end) {
	 			    json_object["endDate"] = doc.date_end;
	 			}
	 			
	 			recordData.push(json_object);
        	}
    	}
    	
    	if (recordData.length > 0) {
			   var dataRec = '{"timeline":{"headline":"Timeline of Events for X","type":"default","date": [';

			   for (var i = 0; i < recordData.length; i++) {
				   var rec = recordData[i];
				   var start_date_str = null;
				   var end_date_str = null;
												 
				   if (rec.startDate) {
					   var start_date = new Date(rec.startDate);
					   var start_day = start_date.getDate();
					   if (start_day < 10) {
						   start_day = "0" + start_day;
					   }
					   var start_month = start_date.getMonth() + 1;
					   if (start_month < 10) {
						   start_month = "0" + start_month;
					   }
					   var start_year = start_date.getFullYear();
			 
					   start_date_str = start_year + "," + start_month + "," + start_day;
				   }
		 
				   if (rec.endDate) {
					   var end_date = new Date(rec.endDate);
					   var end_day = end_date.getDate();
					   if (end_day < 10) {
						   end_day = "0" + end_day;
					   }
					   var end_month = end_date.getMonth() + 1;
					   if (end_month < 10) {
						   end_month = "0" + end_month;
					   }
					   var end_year = end_date.getFullYear();
			 
					   end_date_str = end_year + "," + end_month + "," + end_day;
				   }
		 
				   dataRec += '{"startDate":"' + start_date_str + '",';
				   if (end_date_str) {
					   dataRec += '"endDate":"' + end_date_str + '",';
				   }
				   dataRec += '"headline":"' + rec.name + '",'
				   dataRec += '"text":"' + rec.uri + '",';
				   dataRec += '"asset":{"media":"' + rec.uri + '"}}';
		 
				   if (i < (recordData.length - 1)) {
					   dataRec += ',';
				   }
			   }
			   dataRec += ']}}';
	 

			   $("#timeline-frame")[0].onload = function() {
				   $("#timeline-frame")[0].contentWindow
				   		.postMessage(dataRec, '*');
			   }
			   $("#timeline-frame")[0].src = $("#timeline-frame")[0].src;
		   }
    }, params);
}
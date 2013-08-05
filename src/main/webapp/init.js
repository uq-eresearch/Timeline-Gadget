var oThis = this;

var NAMESPACES = {
    "dc"      	: "http://purl.org/dc/elements/1.1/",
    "dc10"    	: "http://purl.org/dc/elements/1.1/",
    "dcterms" 	: "http://purl.org/dc/terms/",
    "ore"     	: "http://www.openarchives.org/ore/terms/",
    "foaf"    	: "http://xmlns.com/foaf/0.1/",
    "layout"  	: "http://maenad.itee.uq.edu.au/lore/layout.owl#",
    "rdf"     	: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "xhtml"   	: "http://www.w3.org/1999/xhtml",
    "annotea" 	: "http://www.w3.org/2000/10/annotation-ns#",
    "annotype"	: "http://www.w3.org/2000/10/annotationType#",
    "thread"  	: "http://www.w3.org/2001/03/thread#",
    "annoreply" : "http://www.w3.org/2001/12/replyType#",
    "vanno"   	: "http://austlit.edu.au/ontologies/2009/03/lit-annotation-ns#",
    "sparql"  	: "http://www.w3.org/2005/sparql-results#",
    "http"    	: "http://www.w3.org/1999/xx/http#",
    "xsd"     	: "http://www.w3.org/2001/XMLSchema#",
    "oac"     	: "http://www.openannotation.org/ns/",
    "owl"     	: "http://www.w3.org/2002/07/owl#",
    "rdfs"    	: "http://www.w3.org/2000/01/rdf-schema#",
    "austlit" 	: "http://austlit.edu.au/owl/austlit.owl#",
    "danno"   	: "http://metadata.net/2009/09/danno#",
    "lorestore" : "http://auselit.metadata.net/lorestore/",
    "cnt"     	: "http://www.w3.org/2011/content#",
    "ecrm"		: "http://erlangen-crm.org/current/",
    "skos"		: "http://www.w3.org/2004/02/skos/core#"
};

Ext.onReady(function(){	
    var panel = new Ext.Panel({
        width:744,
        height:595,

        tbar: new Ext.ux.StatusBar({
            defaultText: '',
            id: 'statusBar',
            statusAlign: 'right', 
        	items:        	
        	[
            {
            	xtype: 'tbspacer'
            },
            {
                text: 'Import',
                menu: [
					{
						text: 'Import from LORE',
						menu: [
						       new Ext.Action({
						    	   text: 'RDF/XML',
						    	   handler: function(){
						    		   $('#myInput')[0].onchange = function(result) {													 
						    			   var reader = new FileReader();
						    			   var recordData = [];
								 
						    			   reader.onload = function(e) {	 
						    				   var data = e.target.result;
						    				   var doc = new DOMParser().parseFromString(data, "text/xml");
									 
						    				   var databank = jQuery.rdf.databank();
						    				   for (ns in NAMESPACES) {
						    					   databank.prefix(ns, NAMESPACES[ns]);
						    				   }
						    				   databank.load(doc);
						    				   var loadedRDF = jQuery.rdf({
						    					   databank : databank
						    				   });
							         
						    				   var remQuery = loadedRDF.where('?url dc:title ?title')
						    				   		.optional('?url dc:date-begin ?startDate')
						    				   		.optional('?url dc:date-end ?endDate');
							         							         
						    				   for (var i = 0; i < remQuery.length; i++) {
						    					   var res = remQuery.get(i);
								         
						    					   var json_object = {
						    							   name : res.title.value.toString(),
						    							   uri : res.url.value.toString()};
						    					   if (!(res.startDate === undefined)) {
						    						   json_object["startDate"] = res.startDate.value;
						    					   }
						    					   if (!(res.endDate === undefined)) {
						    						   json_object["endDate"] = res.endDate.value;
						    					   }
						    					   if (!((res.startDate === undefined) &&
						    							   res.endDate === undefined)) {
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
							                	   Ext.getCmp("statusBar").setStatus("");
						    				   }
						    			   }
						    			   reader.readAsText(result.target.files[0]);
						    		   }
						    		   $('#myInput').click();
						    	   }
						       }), 
						       new Ext.Action({
						    	   text: 'JSON',
						    	   handler: function(){
						    		   $('#myInput')[0].onchange = function(result) {													 
						    			   var reader = new FileReader();
						    			   reader.onload = function(e) {
						    				   var data = jQuery.parseJSON(e.target.result);
						    				   var recordData = [];
									 
						    				   for (var recordID in data) {
						    					   var record = data[recordID];
										 
						    					   if (record["http://purl.org/dc/elements/1.1/date-begin"] ||
						    							   record["http://purl.org/dc/elements/1.1/date-end"]) {				
						    						   var json_object = {
						    								   name : record["http://purl.org/dc/elements/1.1/title"][0].value,
						    								   uri : recordID};
						    						   if (record["http://purl.org/dc/elements/1.1/date-begin"]) {
						    							   json_object["startDate"] = record["http://purl.org/dc/elements/1.1/date-begin"][0].value;
						    						   }
						    						   if (record["http://purl.org/dc/elements/1.1/date-end"]) {
						    							   json_object["endDate"] = record["http://purl.org/dc/elements/1.1/date-end"][0].value;
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
							                	   Ext.getCmp("statusBar").setStatus("");
						    				   }
						    			   }
						    			   reader.readAsText(result.target.files[0]);
						    		   }
						    		   $('#myInput').click();
						    	   }
						       }
						    )
						]
					},
					new Ext.Action({
	                    text: 'Import From JSON',
	                    handler: function(){
	                    	$('#myInput')[0].onchange = function(result) {													 
								 var reader = new FileReader();
								 reader.onload = function(e) {
									 $("#timeline-frame")[0].onload = function() {
										 $("#timeline-frame")[0].contentWindow
									 		.postMessage(e.target.result, '*');
									 }
									 $("#timeline-frame")[0].src = $("#timeline-frame")[0].src;
			                	     Ext.getCmp("statusBar").setStatus("");
								 }
								 reader.readAsText(result.target.files[0]);
					        }
							$('#myInput').click();
	                    }
                    })
                ]
            },
            {
                xtype: 'tbseparator'
            },
            /*{
        		xtype: 'textfield',
        		fieldLabel: 'searchTerm',
        		id: 'HUNISearchTerm',
        		cls: 'round'
            },
            {
            	xtype: 'tbspacer'
            },*/
            new Ext.Action({
                text: 'Search HuNI',
                handler: function(){
                	Ext.MessageBox.prompt(
	        			'Search HuNI', 
	        			'Please enter your search terms',
	        			function(btn, text){
	                	    if (btn == 'ok'){
	                	        searchHUNI(text);
	                	        Ext.getCmp("statusBar").setStatus("\"" + text + "\"");
	                	    }
	        			}
	        		);
                	//searchHUNI($("#HUNISearchTerm")[0].value);
                }
            })
        ]}),
        listeners : {
        	afterrender : function(c) {
        		/*$.getJSON("http://localhost:8080/timeline/data.json", function(data) {
            		$("#timeline-frame")[0].onload = function() {
            			$("#timeline-frame")[0].contentWindow
    						.postMessage(JSON.stringify(data), '*');
    				}
    				$("#timeline-frame")[0].src = $("#timeline-frame")[0].src;
        		});*/
        	}
        },
        html : "<iframe id='timeline-frame' src='http://localhost:8080/timeline/timeline.html' " +
        		"style='width: 738px; height: 562px;'></div>",
        renderTo: Ext.get("timelinearea")
    });
});
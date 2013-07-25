var oThis = this;

Ext.onReady(function(){
    var panel = new Ext.Panel({
        width:800,
        height:595,

        tbar: [
            {
                text: 'Import Menu',
                menu: [
                    new Ext.Action({
					    text: 'Import RDF/XML',
					    handler: function(){
					    	$('#myInput')[0].onchange = function(result) {													 
								 var reader = new FileReader();
								 reader.onload = function(e) {
									 var data = e.target.result;
									 console.log("Yoman1");
									 console.log(data);
								 }
								 reader.readAsText(result.target.files[0]);
					        }
							$('#myInput').click();
					    }
					}),
					new Ext.Action({
                    text: 'Import From JSON',
                    handler: function(){
                    	$('#myInput')[0].onchange = function(result) {													 
							 var reader = new FileReader();
							 reader.onload = function(e) {
								 var data = jQuery.parseJSON(e.target.result);
								 
								 createStoryJS({
				        			type:		'timeline',
				        			width:		'798',
				        			height:		'566',
				        			source:		data,
				        			embed_id:	'my-timeline'
				        		});
							 }
							 reader.readAsText(result.target.files[0]);
				        }
						$('#myInput').click();
                    }
                })]
            }
        ],

        html : "<div id='my-timeline' style='width: 798px; height: 566px;'></div>",
        renderTo: Ext.get("timelinearea")
    });
});
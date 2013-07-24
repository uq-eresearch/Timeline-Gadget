Ext.onReady(function(){
    // The action
    var action = new Ext.Action({
        text: 'Action 1',
        handler: function(){
            Ext.example.msg('Click','You clicked on "Action 1".');
        },
        iconCls: 'blist'
    });


    var panel = new Ext.Panel({
        width:800,
        height:595,

        tbar: [
            action, {
                text: 'Action Menu',
                menu: [action]
            }
        ],

        html : "<div id=\"my-timeline-2\"></div>",
        listeners : {
        	afterrender : function(c) {
        		createStoryJS({
        			type:		'timeline',
        			width:		'798',
        			height:		'566',
        			source:		'../timeline/example_json.json',
        			embed_id:	'my-timeline-2',
        			debug:		true
        		});
        	}
        },
        renderTo: Ext.getBody()
    });
});
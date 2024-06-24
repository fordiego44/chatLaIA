sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/HTML",
    "sap/m/Panel"
], function (Controller, HTML, Panel) {
    "use strict";

    return Controller.extend("rivercon.chat.controller.Main", {
        onInit: function () {
            var html1 = new HTML("html1", {
                content:
    
                "<video style='width: 100%; height: 100%; object-fit: cover;' autoplay>" +
                "<source src='http://www.w3schools.com/html/movie.mp4' type='video/mp4'>" + 
                "Your browser does not support the video tag." +
                "</video>"  
                
            });

            var html2 = new HTML("html2", {
                content:
    
                "<video style='width: 100%; height: 100%; object-fit: cover;' autoplay>" +
                "<source src='http://www.w3schools.com/html/movie.mp4' type='video/mp4'>" + 
                "Your browser does not support the video tag." +
                "</video>"  
                
            });

            // var oPanel = new Panel({
            //     content: [html1]
            // });

            this.byId("contenido").addItem(html1);

            var oView = this.getView();
            var oJSONModelMessage = new sap.ui.model.json.JSONModel();
            oJSONModelMessage.loadData("./localService/mockData/Message.json", false); 
            oView.setModel(oJSONModelMessage, "jsonMessage");
 
            var oJSONModelVisibility = new sap.ui.model.json.JSONModel({
                visibility: false  
            });
            oView.setModel(oJSONModelVisibility, "onContainer3");
 
            this._addDelegateToVBox();

           

            // var oPanel = new Panel({
            //     content: [html1]
            // });

            this.byId("contenidoM").addItem(html2);

        }, 
     
        openHeadset: function () {
            
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", true);
        },
        closeHeadset: function () {
            
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", false);
        },
        sendHeadset: function () {
            
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", false);

            var message = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here, making it look like readable English. ";
            this.addMessage(message);
        },
        _addDelegateToVBox: function () {
            var oVBox = this.byId("myVBox");
            if (oVBox) {
                oVBox.addEventDelegate({
                    onclick: this.sendHeadset.bind(this)
                });
            }
        }, 
        onSubmitMessage: function (oEvent) {
            var sMessage = oEvent.getParameter("value");
            this.addMessage(sMessage);
            oEvent.getSource().setValue("");   
        },
        addMessage: function ( sMessage  ){
            if (sMessage) {
                var oView = this.getView();
                var oModel = oView.getModel("jsonMessage");
                var newMessage = sap.ui.xmlfragment("rivercon.chat.fragment.MessageUser", this); 
                var listMessage = this.getView().byId("listaMessage"); 
                
                var aMessages = oModel.getData(); 
                var sUsername = "Usuario"; 
                var sCurrentTime = new Date().toISOString();
                var index = aMessages.length;
                var sNewMessageID = String(aMessages.length + 1);  
                var oNewMessage = {
                    "messageID": sNewMessageID,
                    "sender": sUsername,
                    "content": sMessage,
                    "timestamp": sCurrentTime
                };
                aMessages.push(oNewMessage); 
                oModel.refresh();

                newMessage.bindElement("jsonMessage>/" + index);
                listMessage.addContent(newMessage);

                // ---------

                var newMessageIA = sap.ui.xmlfragment("rivercon.chat.fragment.MessageIA", this); 
                listMessage.addContent(newMessageIA);   
                // -----------
                    
                
                setTimeout(function() {
                    var oDomRef = newMessageIA .getDomRef();
                    if (oDomRef) {
                        oDomRef.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 0);
                
            }
        }
    });
});
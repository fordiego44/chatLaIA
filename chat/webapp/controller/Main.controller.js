sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/HTML",
    "sap/m/Panel"
], function (Controller, HTML, Panel) {
    "use strict";

    return Controller.extend("rivercon.chat.controller.Main", {
        onInit: function () {

            this._isPlaying = false;

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
                visibility: false,
                visibilityHeadset: true
            }); 

            oView.setModel(oJSONModelVisibility, "onContainer3");
 
            this._addDelegateToVBox();
            this._addToggleToVBox();
            this._closeToVBox();
           

            // var oPanel = new Panel({
            //     content: [html1]
            // });

            this.byId("contenidoM").addItem(html2); 
        }, 

        _startListeningAnimation: function () {
            var aCircles = [
                this.byId("circle1"),
                this.byId("circle2"),
                this.byId("circle3"),
                this.byId("circle4")
            ];

            aCircles.forEach(function (oCircle, index) {
                // Agrega un pequeño retraso para cada círculo para hacer la animación más interesante
                setTimeout(function () {
                    oCircle.addStyleClass("listening");
                }, index * 1500); // Retraso de 200 ms entre cada círculo
            });
        },
        _stopListeningAnimation: function () {
            var aCircles = [
                this.byId("circle1"),
                this.byId("circle2"),
                this.byId("circle3"),
                this.byId("circle4")
            ];

            aCircles.forEach(function (oCircle) {
                oCircle.removeStyleClass("listening");
            });
        },
     
        openHeadset: function () {
            
            // Obtiene el ícono dentro del VBox
            var oIcon = this.byId("toggleIcon");
            this._isPlaying = true;
            oIcon.setSrc("sap-icon://media-pause"); 
            
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", true); 
            oModel.setProperty("/visibilityHeadset", true); 

            this._startListeningAnimation();
            
        }, 
        sendHeadset: function () {
            
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", false);

            var message = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here, making it look like readable English. ";
            this.addMessage(message);

            this._stopListeningAnimation();
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
        },
        _addDelegateToVBox: function () {
            var oVBox = this.byId("myVBox");
            if (oVBox) {
                oVBox.addEventDelegate({
                    onclick: this.sendHeadset.bind(this)
                });
            }
        }, 
        _addToggleToVBox: function () {
            var oVBox = this.byId("myVBoxToggle");
            if (oVBox) {
                oVBox.addEventDelegate({
                    onclick: this.onTogglePress.bind(this)
                });
            }
        }, 
        _closeToVBox: function () {
            var oVBox = this.byId("closeVBox");
            if (oVBox) {
                oVBox.addEventDelegate({
                    onclick: this.onClosePress.bind(this)
                });
            }
        }, 
        onTogglePress: function () { 
            // Alterna el estado de reproducción
            this._isPlaying = !this._isPlaying;  

            // Obtiene el ícono dentro del VBox
            var oIcon = this.byId("toggleIcon");

            var oModel = this.getView().getModel("onContainer3");
            // Cambia el ícono del botón según el estado
            if (!this._isPlaying) {
                oIcon.setSrc("sap-icon://media-play");  
                oModel.setProperty("/visibilityHeadset", false); 
                this._stopListeningAnimation();
            } else {
                oIcon.setSrc("sap-icon://media-pause");
                oModel.setProperty("/visibilityHeadset", true); 
                this._startListeningAnimation();
            }
        },

        onClosePress: function () { 
            this._isPlaying = false;  
            var oModel = this.getView().getModel("onContainer3");
            oModel.setProperty("/visibility", false);

            this._stopListeningAnimation();
            
        }
    });
});
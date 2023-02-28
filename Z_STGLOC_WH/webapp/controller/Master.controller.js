sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessagePopoverItem",
    "sap/ui/model/Filter",
    "sap/m/MessagePopover"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessagePopoverItem, Filter, MessagePopover) {
        "use strict";

        return Controller.extend("com.itgbrands.stock.transfer.STGLOC_WH.Z_STGLOC_WH.controller.Master", {
            onInit: function () {
                if (!jQuery.support.touch) {
                    this.getView().removeStyleClass("sapUiSizeCozy");
                    this.getView().addStyleClass("sapUiSizeCompact");
                } else {
                    this.getView().removeStyleClass("sapUiSizeCompact");
                    this.getView().addStyleClass("sapUiSizeCozy");
                }
                this.BusyIndicator = new sap.m.BusyDialog();
            },
            onAfterRendering: function () {
                var that = this;
                var oData = {
                    "SelectedProduct": "Indicator 1",
                    "ProductCollection": [{
                        "Name": "Indicator 1"
                    }, {
                        "Name": "Indicator 2"
                    }, {
                        "Name": "Indicator 3"
                    }],
                    "Editable": true,
                    "Enabled": true
                };

                // set explored app's demo model on this sample
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);

                var oData1 = {
                    "SelectedReasonCode": "608",
                    "ReasonCodeArray": [{
                        "ReasonCode": "608",
                        "ReasonName": "Other"
                    }, {
                        "ReasonCode": "614",
                        "ReasonName": "Aged"
                    }, {
                        "ReasonCode": "615",
                        "ReasonName": "Off Spec"
                    }, {
                        "ReasonCode": "616",
                        "ReasonName": "Balance Room Adjustm"
                    }],
                    "Editable": true,
                    "Enabled": true
                };

                // set explored app's demo model on this sample
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);
                var oModel = new JSONModel(oData1);
                this.getView().setModel(oModel, "ReasonCodeModel");
                /*      FOCUS ON TOP BARCODE  */
                setTimeout(function () {
                    that.getView().byId("TopBarcode_Input").focus();
                }, 400);
            },
            fnCloseMsg: function () {
                var that = this;
                if (that.getView().byId("TopBarcode_Input").getValue() === "") {
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("TopBarcode_Input").focus();
                    }, 400);
                } else if (that.getView().byId("BotBarcode_Input").getValue() === "") {
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);
                } else if (that.getView().byId("PlantSloc_Input").getValue() === "") {
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("PlantSloc_Input").focus();
                    }, 400);
                } else if (that.getView().byId("BinBarcode_Input").getValue() === "") {
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("BinBarcode_Input").focus();
                    }, 400);
                } else if (that.getView().byId("idSelectReasoncode").getSelectedKey() === "") {
                    that.getView().byId("idSelectReasoncode").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("idSelectReasoncode").focus();
                    }, 400);
                } else {
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("idSelectIndicator").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("idSelectReasoncode").setValueState(sap.ui.core.ValueState.None);

                    setTimeout(function () {
                        that.getView().byId("TopBarcode_Input").focus();
                    }, 400);
                }

            },

            /*  FIRST TOP BARCODE CALLED  */
            fnscandTopBarcode: function (oEvent) {
                var that = this;
                /*  IF TOP_BARCODE IS NOT BLANK */
                if (this.getView().byId("TopBarcode_Input").getValue() !== "") {
                    var TopBarcode = that.getView().byId("TopBarcode_Input").getValue();
                    var palletNum = TopBarcode.substring(16, 21);
                    that.getView().byId("PalletNum_Input").setValue("Pallet Number: " + palletNum);
                    that.getView().byId("PalletNum_Input").setVisible(true);
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(true);
                    that.getView().byId("BinBarcode_Input").setEnabled(false);
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);

                }
                /*  IF TOP_BARCODE IS BLANK    */
                else {
                    var TopBarcode = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TopBarcode");
                    that.getView().byId("TopBarcode_Input").setEnabled(true);
                    that.getView().byId("BotBarcode_Input").setEnabled(false);
                    that.getView().byId("BinBarcode_Input").setEnabled(false);
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Top", TopBarcode);
                    setTimeout(function () {
                        that.getView().byId("TopBarcode_Input").focus();
                    }, 400);
                }
            },
            /*Live change function of Top Barcode */
            fnTopBarcode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(true);
                that.getView().byId("BotBarcode_Input").setEnabled(false);
                that.getView().byId("BinBarcode_Input").setEnabled(false);
                that.getView().byId("create").setEnabled(false);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);

            },
            /*  SECOND BotBarcode_Input  CALLED    */
            fnscandBotBarcode: function (oEvent) {
                var that = this;
                /*  IF BotBarcode_Input IS NOT BLANK    */
                if (that.getView().byId("BotBarcode_Input").getValue() !== "") {
                    var botBarcode = that.getView().byId("BotBarcode_Input").getValue();
                    var words = botBarcode.substring(10, 21);
                    var quantity = words.replace(/^0+/, '');
                    var len = quantity.length - 3;
                    that.getView().byId("Quentity_Input").setValue("Quantity: " + parseFloat(quantity.substring(0, len)).toFixed(3));
                    that.getView().byId("Quentity_Input").setVisible(true);
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.byId("TopBarcode_Input").setEnabled(false);
                    that.byId("BotBarcode_Input").setEnabled(false);
                    that.byId("PlantSloc_Input").setEnabled(true);
                    that.byId("BinBarcode_Input").setEnabled(false);
                    setTimeout(function () {
                        that.getView().byId("PlantSloc_Input").focus();
                    }, 400);

                }
                /*  IF BotBarcode_Input IS BLANK    */
                else {
                    var BottomBarcode = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BottomBarcode");
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Bot", BottomBarcode);
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(true);
                    that.getView().byId("PlantSloc_Input").setEnabled(false);
                    that.getView().byId("BinBarcode_Input").setEnabled(false);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);
                }
            },
            /*Live change function of Bottom Barcode*/
            fnBottomBarcode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(false);
                that.getView().byId("BotBarcode_Input").setEnabled(true);
                that.getView().byId("BinBarcode_Input").setEnabled(false);
                that.getView().byId("create").setEnabled(false);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
            },
            fnscandPlantSloc: function (oEvent) {
                var that = this;
                /*  IF PlantSloc_Input IS NOT BLANK    */
                if (that.getView().byId("PlantSloc_Input").getValue() !== "") {
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.byId("TopBarcode_Input").setEnabled(false);
                    that.byId("BotBarcode_Input").setEnabled(false);
                    that.byId("PlantSloc_Input").setEnabled(false);
                    that.byId("BinBarcode_Input").setEnabled(true);
                    setTimeout(function () {
                        that.getView().byId("BinBarcode_Input").focus();
                    }, 400);

                }
                /*  IF PlantSloc_Input IS BLANK    */
                else {
                    var PlantSloc = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("PlantSloc");
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Plant/Sloc", PlantSloc);
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(false);
                    that.getView().byId("PlantSloc_Input").setEnabled(true);
                    that.getView().byId("BinBarcode_Input").setEnabled(false);
                    setTimeout(function () {
                        that.getView().byId("PlantSloc_Input").focus();
                    }, 400);
                }
            },
            /*Live change function of Plant Sloc*/
            fnPlantSloc: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(false);
                that.getView().byId("BotBarcode_Input").setEnabled(false);
                that.getView().byId("PlantSloc_Input").setEnabled(true);
                that.getView().byId("BinBarcode_Input").setEnabled(false);
                that.getView().byId("create").setEnabled(false);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
            },
            fnscandBinNumber: function (oEvent) {
                var that = this;
                /*  IF BinBarcode_Input IS NOT BLANK    */
                if (that.getView().byId("BinBarcode_Input").getValue() !== "") {
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                    that.byId("TopBarcode_Input").setEnabled(false);
                    that.byId("BotBarcode_Input").setEnabled(false);
                    that.byId("PlantSloc_Input").setEnabled(false);
                    that.byId("BinBarcode_Input").setEnabled(false);
                    that.byId("idSelectIndicator").setEnabled(true);
                    that.byId("create").setEnabled(true);
                    setTimeout(function () {
                        that.getView().byId("idSelectIndicator").focus();
                    }, 400);

                }
                /*  IF BinBarcode_Input IS BLANK    */
                else {
                    var BinNum = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BinNumber1");
                    that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Bin", BinNum);
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(false);
                    that.getView().byId("PlantSloc_Input").setEnabled(false);
                    that.getView().byId("BinBarcode_Input").setEnabled(true);
                    setTimeout(function () {
                        that.getView().byId("BinBarcode_Input").focus();
                    }, 400);
                }
            },
            /*Live change function of Bin Barcode*/
            fnBinBarcode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(false);
                that.getView().byId("BotBarcode_Input").setEnabled(false);
                that.getView().byId("BinBarcode_Input").setEnabled(true);
                that.getView().byId("create").setEnabled(false);
                that.byId("idSelectIndicator").setEnabled(true);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
            },
            //	onPost click on post 
            onPost: function () {
                var that = this;
                var oModel = this.getView().getModel("StockTransferOmodel");
                var topBarcode = that.byId("TopBarcode_Input").getValue();
                var botBarcode = that.byId("BotBarcode_Input").getValue();
                var binBarcode = that.byId("BinBarcode_Input").getValue();
                var PlantSloc = that.byId("PlantSloc_Input").getValue();
                var ImpQuantity = that.byId("Quentity_Input").getValue().split(": ")[1];
                var ReasonCode = that.getView().byId("idSelectReasoncode").getSelectedKey();
                var oMsgStrip = that.getView().byId("MessageStripID");
                var aFilters = [];
                var ReasonCodeMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Reasoncode");

                if (that.getView().byId("idSelectIndicator").getSelectedKey() === "Indicator 2") {
                    aFilters.push(new Filter("TopBarcode", sap.ui.model.FilterOperator.EQ, topBarcode));
                    aFilters.push(new Filter("BotBarcode", sap.ui.model.FilterOperator.EQ, botBarcode));
                    //aFilters.push(new Filter("ImpQuantity", sap.ui.model.FilterOperator.EQ, ImpQuantity));
                    aFilters.push(new Filter("StgBarcode", sap.ui.model.FilterOperator.EQ, PlantSloc));
                    aFilters.push(new Filter("BinBarcode", sap.ui.model.FilterOperator.EQ, binBarcode));
                    aFilters.push(new Filter("TransferType", sap.ui.model.FilterOperator.EQ, "03"));
                    aFilters.push(new Filter("ImpStckstat", sap.ui.model.FilterOperator.EQ, "02"));
                    aFilters.push(new Filter("ImpReasmove", sap.ui.model.FilterOperator.EQ, "0" + ReasonCode));
                }
                else if (that.getView().byId("idSelectIndicator").getSelectedKey() === "Indicator 1") {
                    aFilters.push(new Filter("TopBarcode", sap.ui.model.FilterOperator.EQ, topBarcode));
                    aFilters.push(new Filter("BotBarcode", sap.ui.model.FilterOperator.EQ, botBarcode));
                    //aFilters.push(new Filter("ImpQuantity", sap.ui.model.FilterOperator.EQ, ImpQuantity));
                    aFilters.push(new Filter("StgBarcode", sap.ui.model.FilterOperator.EQ, PlantSloc));
                    aFilters.push(new Filter("BinBarcode", sap.ui.model.FilterOperator.EQ, binBarcode));
                    aFilters.push(new Filter("TransferType", sap.ui.model.FilterOperator.EQ, "03"));
                    aFilters.push(new Filter("ImpStckstat", sap.ui.model.FilterOperator.EQ, "01"));
                    aFilters.push(new Filter("ImpReasmove", sap.ui.model.FilterOperator.EQ, "0000"));
                }
                else if (that.getView().byId("idSelectIndicator").getSelectedKey() === "Indicator 3") {
                    aFilters.push(new Filter("TopBarcode", sap.ui.model.FilterOperator.EQ, topBarcode));
                    aFilters.push(new Filter("BotBarcode", sap.ui.model.FilterOperator.EQ, botBarcode));
                    //aFilters.push(new Filter("ImpQuantity", sap.ui.model.FilterOperator.EQ, ImpQuantity));
                    aFilters.push(new Filter("StgBarcode", sap.ui.model.FilterOperator.EQ, PlantSloc));
                    aFilters.push(new Filter("BinBarcode", sap.ui.model.FilterOperator.EQ, binBarcode));
                    aFilters.push(new Filter("TransferType", sap.ui.model.FilterOperator.EQ, "03"));
                    aFilters.push(new Filter("ImpStckstat", sap.ui.model.FilterOperator.EQ, "03"));
                    aFilters.push(new Filter("ImpReasmove", sap.ui.model.FilterOperator.EQ, "0000"));
                }
                if (that.getView().byId("idSelectReasoncode").getVisible() === true && ReasonCode === "" && that.getView().byId("idSelectReasoncode").getEnabled() ===
                    true) {
                    that.byId("create").setEnabled(false);
                    that.getView().byId("idSelectReasoncode").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("ReasonCode", ReasonCodeMsg);
                    setTimeout(function () {
                        that.getView().byId("idSelectReasoncode").focus();
                    }, 400);
                } else if (topBarcode !== "" && botBarcode !== "" && binBarcode !== "" && PlantSloc !== "") {
                    that.BusyIndicator.open();
                    oModel.read("/StockTransferSet", {
                        context: true,
                        async: false,
                        filters: aFilters,
                        success: function (oData, oResponse) {
                            that.BusyIndicator.close();
                            //var Message1 = oData.results[0].Message;
                            /*var Message2 = oData.results[1].Message;
                            var Message3 = oData.results[2].Message;*/
                            that.updateMessageStrip(sap.ui.core.MessageType.Success, 'Success - Posted.');
                            that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.byId("TopBarcode_Input").setValue("");
                            that.byId("BotBarcode_Input").setValue("");
                            that.byId("Quentity_Input").setValue("");
                            that.getView().byId("PalletNum_Input").setValue("");
                            that.byId("PlantSloc_Input").setValue("");
                            that.byId("BinBarcode_Input").setValue("");
                            that.byId("TopBarcode_Input").setEnabled(true);
                            that.byId("BotBarcode_Input").setEnabled(false);
                            that.byId("PlantSloc_Input").setEnabled(false);
                            that.byId("BinBarcode_Input").setEnabled(false);
                            that.byId("idSelectIndicator").setEnabled(false);
                            that.byId("idSelectReasoncode").setEnabled(false);
                            that.byId("idSelectReasoncode").setVisible(false);
                            that.byId("create").setEnabled(false);
                            that.byId("Quentity_Input").setVisible(false);
                            that.getView().byId("PalletNum_Input").setVisible(false);
                            setTimeout(function () {
                                that.getView().byId("TopBarcode_Input").focus();
                            }, 400);
                        },
                        error: function (err) {
                            that.BusyIndicator.close();
                            var ResponseMsg = JSON.parse(err.responseText).error.message.value;
                            that.createNewErrorLog("oDataError", ResponseMsg);
                            that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.byId("TopBarcode_Input").setValue("");
                            that.byId("BotBarcode_Input").setValue("");
                            that.byId("Quentity_Input").setValue("");
                            that.byId("PalletNum_Input").setValue("");
                            that.byId("PlantSloc_Input").setValue("");
                            that.byId("BinBarcode_Input").setValue("");
                            that.byId("TopBarcode_Input").setEnabled(true);
                            that.byId("BotBarcode_Input").setEnabled(false);
                            that.byId("PlantSloc_Input").setEnabled(false);
                            that.byId("BinBarcode_Input").setEnabled(false);
                            that.byId("idSelectIndicator").setEnabled(false);
                            that.byId("idSelectReasoncode").setEnabled(false);
                            that.byId("idSelectReasoncode").setVisible(false);
                            that.byId("create").setEnabled(false);
                            that.byId("Quentity_Input").setVisible(false);
                            that.getView().byId("PalletNum_Input").setVisible(false);
                            setTimeout(function () {
                                that.getView().byId("TopBarcode_Input").focus();
                            }, 400);
                        }
                    });
                } else {
                    that.createNewErrorLog("AllField", ReasonCodeMsg);
                }
            },
            hideMessageStrip: function () {
                var oMsgStrip = this.getView().byId("MessageStripID");
                if (oMsgStrip.getVisible()) {
                    oMsgStrip.setVisible(false);
                }
            },
            updateMessageStrip: function (msgType, text) {
                var oMsgStrip = this.getView().byId("MessageStripID");
                if (!oMsgStrip.getVisible()) {
                    oMsgStrip.setVisible(true);
                }
                oMsgStrip.setType(msgType);
                oMsgStrip.setText(text);
            },
            createNewErrorLog: function (oError, titleName) {
                var that = this;
                var TopBarcodeisMandetory = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TopBarcodeisMandetory");
                var BinBarcodeisMandetory = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BinBarcodeisMandetory");
                var BottomBarcodeisMandetory = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BottomBarcodeisMandetory");
                var PlantocisMandetory = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("PlantocisMandetory");
                var ReasonCodeisMandetory = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ReasonCodeisMandetory");
                var description = "";
                if (oError === "Top") {
                    description = TopBarcodeisMandetory;
                } else if (oError === "Bot") {
                    description = BottomBarcodeisMandetory;
                } else if (oError === "Bin") {
                    description = BinBarcodeisMandetory;
                } else if (oError === "Plant/Sloc") {
                    description = PlantocisMandetory;
                } else if (oError === "ReasonCode") {
                    description = ReasonCodeisMandetory;
                } else if (oError === "AllField") {
                    description = "All fields are Mandatory ";
                } else if (oError === "oDataError") {
                    description = titleName;
                }
                that.updateMessageStrip(sap.ui.core.MessageType.Error, description);
            },
            fnOnSelectIndicator: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                if (oEvent.oSource.mProperties.selectedKey === "Indicator 2") {
                    that.getView().byId("create").setEnabled(false);
                    that.getView().byId("idSelectReasoncode").setVisible(true);
                    that.getView().byId("idSelectReasoncode").setEnabled(true);
                    that.byId("create").setEnabled(true);
                    that.getView().byId("idSelectReasoncode").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("idSelectReasoncode").focus();
                    }, 400);
                } else {
                    that.getView().byId("idSelectReasoncode").setVisible(false);
                    that.getView().byId("idSelectReasoncode").setEnabled(false);
                    that.getView().byId("idSelectReasoncode").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("create").setEnabled(true);


                }
            },
            fnOnSelectReasonCode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                if (oEvent.oSource.mProperties.selectedKey !== " ") {
                    that.getView().byId("create").setEnabled(true);
                } else {
                    that.getView().byId("create").setEnabled(false);
                }
            },
            // onclear Btn click
            onClear: function () {
                var that = this;
                that.hideMessageStrip();
                this.byId("TopBarcode_Input").setEnabled(true);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("PlantSloc_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BinBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.byId("TopBarcode_Input").setValue("");
                that.byId("BotBarcode_Input").setValue("");
                that.byId("Quentity_Input").setValue("");
                that.byId("PalletNum_Input").setValue("");
                that.byId("PlantSloc_Input").setValue("");
                that.byId("BinBarcode_Input").setValue("");
                that.getView().byId("PalletNum_Input").setVisible(false);
                that.getView().byId("Quentity_Input").setVisible(false);
                that.byId("BotBarcode_Input").setEnabled(false);
                that.byId("PlantSloc_Input").setEnabled(false);
                that.byId("BinBarcode_Input").setEnabled(false);
                that.byId("idSelectIndicator").setEnabled(false);
                that.getView().byId("idSelectIndicator").setSelectedKey("Indicator 1");
                that.getView().byId("idSelectReasoncode").setVisible(false);
                that.byId("idSelectReasoncode").setEnabled(false);
                that.byId("create").setEnabled(false);
                setTimeout(function () {
                    that.getView().byId("TopBarcode_Input").focus();
                }, 400);
            }
        });
    });

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

        return Controller.extend("com.itgbrands.stock.transfer.WH_TO_PRDSTG.Z_WH_TO_PRDSTG.controller.Master", {
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
                }
                else if (that.getView().byId("BotBarcode_Input").getValue() === "") {
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);
                }
                else if (that.getView().byId("StagingLocation_Input").getValue() === "") {
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("StagingLocation_Input").focus();
                    }, 400);
                }
                else {
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
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
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(true);
                    that.getView().byId("StagingLocation_Input").setEnabled(false);
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);

                }
                /*  IF TOP_BARCODE IS BLANK    */
                else {
                    var TopBarcode = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TopBarcode");
                    that.getView().byId("TopBarcode_Input").setEnabled(true);
                    that.getView().byId("BotBarcode_Input").setEnabled(false);
                    that.getView().byId("StagingLocation_Input").setEnabled(false);
                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None)
                    that.createNewErrorLog("Top", TopBarcode);
                    setTimeout(function () {
                        that.getView().byId("TopBarcode_Input").focus();
                    }, 400);
                }
            },
            fnTopBarcode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(true);
                that.getView().byId("BotBarcode_Input").setEnabled(false);
                that.getView().byId("StagingLocation_Input").setEnabled(false);
                that.getView().byId("create").setEnabled(false);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);

            },
            /*  SECOND BotBarcode_Input  CALLED    */
            fnscandBotBarcode: function (oEvent) {
                var that = this;
                /*  IF BotBarcode_Input IS NOT BLANK    */
                if (that.getView().byId("BotBarcode_Input").getValue() !== "") {
                    var oModel = this.getView().getModel("StockTransferOmodel");
                    var topBarcode = that.byId("TopBarcode_Input").getValue();
                    var botBarcode = that.byId("BotBarcode_Input").getValue();
                    var aFilters = [];
                    aFilters.push(new Filter("TopBarcode", sap.ui.model.FilterOperator.EQ, topBarcode));
                    aFilters.push(new Filter("BotBarcode", sap.ui.model.FilterOperator.EQ, botBarcode));
                    aFilters.push(new Filter("ImpStckstat", sap.ui.model.FilterOperator.EQ, "02"));
                    var words = botBarcode.substring(10, 21);
                    var quantity = words.replace(/^0+/, '');
                    var len = quantity.length - 3;
                    that.getView().byId("Quentity_Input").setValue(parseFloat(quantity.substring(0, len)).toFixed(3));
                    that.BusyIndicator.open();
                    oModel.read("/StockTransferSet", {
                        context: true,
                        async: false,
                        filters: aFilters,
                        success: function (oData, oResponse) {
                            that.BusyIndicator.close();
                            var Message1 = oData.results[0].ExpEditqty;
                            if (Message1 === 1) {
                                that.byId("Quentity_Input").setEnabled(true);
                            }
                            else if (Message1 === 0) {
                                that.byId("Quentity_Input").setEnabled(false);
                            }
                        },
                        error: function (err) {
                            that.BusyIndicator.close();
                            var ResponseMsg = JSON.parse(err.responseText).error.message.value;
                            that.createNewErrorLog("oDataError", ResponseMsg);
                        }
                    });

                    that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                    that.byId("TopBarcode_Input").setEnabled(false);
                    that.byId("BotBarcode_Input").setEnabled(false);
                    that.byId("StagingLocation_Input").setEnabled(true);
                    setTimeout(function () {
                        that.getView().byId("StagingLocation_Input").focus();
                    }, 400);
                }
                /*  IF BotBarcode_Input IS BLANK    */
                else {
                    var BottomBarcode = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BottomBarcode");
                    that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Bot", BottomBarcode);
                    that.getView().byId("TopBarcode_Input").setEnabled(false);
                    that.getView().byId("BotBarcode_Input").setEnabled(true);
                    that.byId("Quentity_Input").setEnabled(false);
                    that.getView().byId("StagingLocation_Input").setEnabled(false);
                    setTimeout(function () {
                        that.getView().byId("BotBarcode_Input").focus();
                    }, 400);
                }
            },
            fnBottomBarcode: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("TopBarcode_Input").setEnabled(false);
                that.getView().byId("BotBarcode_Input").setEnabled(true);
                that.getView().byId("StagingLocation_Input").setEnabled(false);
                that.getView().byId("create").setEnabled(false);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
            },
            fnStagingLocation: function (oEvent) {
                var that = this;
                that.hideMessageStrip();
                that.getView().byId("create").setEnabled(true);
                that.getView().byId("TopBarcode_Input").setEnabled(false);
                that.getView().byId("BotBarcode_Input").setEnabled(false);
                that.getView().byId("StagingLocation_Input").setEnabled(true);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
            },
            //	onPost click on post 
            onPost: function () {
                var that = this;
                var oModel = this.getView().getModel("StockTransferOmodel");
                var topBarcode = that.byId("TopBarcode_Input").getValue();
                var botBarcode = that.byId("BotBarcode_Input").getValue();
                var binBarcode = that.byId("StagingLocation_Input").getValue();
                var Quentity = that.byId("Quentity_Input").getValue();
                var oMsgStrip = this.getView().byId("MessageStripID");
                var aFilters = [];
                aFilters.push(new Filter("TopBarcode", sap.ui.model.FilterOperator.EQ, topBarcode));
                aFilters.push(new Filter("BotBarcode", sap.ui.model.FilterOperator.EQ, botBarcode));
                aFilters.push(new Filter("BinBarcode", sap.ui.model.FilterOperator.EQ, binBarcode));
                aFilters.push(new Filter("TransferType", sap.ui.model.FilterOperator.EQ, "03"));
                aFilters.push(new Filter("ImpStckstat", sap.ui.model.FilterOperator.EQ, "02"));
                aFilters.push(new Filter("ImpQuantity", sap.ui.model.FilterOperator.EQ, Quentity));
                if (binBarcode === "") {
                    var BinBarcode = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("BinBarcode");
                    that.byId("create").setEnabled(false);
                    that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.Error);
                    that.createNewErrorLog("Bin", BinBarcode);
                    setTimeout(function () {
                        that.getView().byId("StagingLocation_Input").focus();
                    }, 400);
                }
                if (topBarcode !== "" && botBarcode !== "" && binBarcode !== "") {
                    that.BusyIndicator.open();
                    oModel.read("/StockTransferSet", {
                        context: true,
                        async: false,
                        filters: aFilters,
                        success: function (oData, oResponse) {
                            that.BusyIndicator.close();
                            var Message1 = oData.results[0].Message;
                            var Message2 = oData.results[1].Message;
                            var Message3 = oData.results[2].Message;
                            that.updateMessageStrip(sap.ui.core.MessageType.Success, Message1 + ' - ' + Message2 + ' - ' + Message3);
                            that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                            that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                            that.byId("TopBarcode_Input").setValue("");
                            that.byId("BotBarcode_Input").setValue("");
                            that.byId("Quentity_Input").setValue("");
                            that.getView().byId("PalletNum_Input").setValue("");
                            //	that.byId("PalletNum_Input").setValue("");
                            that.byId("StagingLocation_Input").setValue("");
                            that.byId("TopBarcode_Input").setEnabled(true);
                            that.byId("BotBarcode_Input").setEnabled(false);
                            that.byId("Quentity_Input").setEnabled(false);
                            that.byId("StagingLocation_Input").setEnabled(false);
                            that.byId("create").setEnabled(false);

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
                            that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                            that.byId("TopBarcode_Input").setValue("");
                            that.byId("BotBarcode_Input").setValue("");
                            that.byId("Quentity_Input").setValue("");
                            that.byId("PalletNum_Input").setValue("");
                            that.byId("StagingLocation_Input").setValue("");
                            that.byId("TopBarcode_Input").setEnabled(true);
                            that.byId("BotBarcode_Input").setEnabled(false);
                            that.byId("Quentity_Input").setEnabled(false);
                            that.byId("StagingLocation_Input").setEnabled(false);
                            that.byId("create").setEnabled(false);
                            setTimeout(function () {
                                that.getView().byId("TopBarcode_Input").focus();
                            }, 400);
                        }
                    });
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
                var description = "";
                if (oError === "Top") {
                    description = TopBarcodeisMandetory;
                } else if (oError === "Bot") {
                    description = BottomBarcodeisMandetory;
                } else if (oError === "Bin") {
                    description = BinBarcodeisMandetory;
                } else if (oError === "oDataError") {
                    description = titleName;
                }
                that.updateMessageStrip(sap.ui.core.MessageType.Error, description);
            },

            // onclear Btn click
            onClear: function () {
                var that = this;
                that.hideMessageStrip();
                this.byId("TopBarcode_Input").setEnabled(true);
                that.getView().byId("TopBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("BotBarcode_Input").setValueState(sap.ui.core.ValueState.None);
                that.getView().byId("StagingLocation_Input").setValueState(sap.ui.core.ValueState.None);
                this.byId("TopBarcode_Input").setValue("");
                this.byId("BotBarcode_Input").setValue("");
                this.byId("Quentity_Input").setValue("");
                that.byId("PalletNum_Input").setValue("");
                this.byId("StagingLocation_Input").setValue("");
                this.byId("BotBarcode_Input").setEnabled(false);
                that.byId("Quentity_Input").setEnabled(false);
                this.byId("StagingLocation_Input").setEnabled(false);
                this.byId("create").setEnabled(false);
                setTimeout(function () {
                    that.getView().byId("TopBarcode_Input").focus();
                }, 400);
            }
        });
    });

import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Registered } from '../both/collections';
import './main.html';

AutoForm.setDefaultTemplate('materialize');
AutoForm.hooks({
    insertRegisteredForm: {
        before: {
            insert(doc) {
                Meteor.call('exist', doc, (err, res) => {
                    if(err){
                        console.log(err);
                    }else{
                        if(!res)
                            alert('Email already exist.');
                        this.result(res);
                    }
                });
            }
        },
        after: {
            insert(err, res) {
                if(err){
                    console.log(err);
                    alert(err);
                }else{
                    alert('You are registered !')
                }
            }
        }
    },
    updatePairingDays: {
        after: {
            update(err, res) {
                if(err){
                    console.log(err);
                    alert(err);
                }else{
                    alert('Your account have been updated !')
                }
            }
        }
    }
}, true);

Template.form.helpers({
  registered() {
    return Registered;
  }
});

Template.accept.onCreated(() => {
    Registered.update({_id: FlowRouter.getParam("_id")}, {$set: {isPairedToday: true}});
});

Template.reject_week.onCreated(() => {
    Registered.update({_id: FlowRouter.getParam("_id")}, {$set: {isPairedWeek: false}});
});

Template.change_pairing_days.onCreated(() => {
   this.subscribe = Meteor.subscribe('update_week', FlowRouter.getParam('_id'));
});

Template.change_pairing_days.helpers({
    currentUser(){
        return Registered.findOne({_id: FlowRouter.getParam('_id')});
    },
    registered() {
        return Registered;
    }
});

Template.unsubscribe.onCreated(() => {
    Registered.remove({_id: FlowRouter.getParam("_id")});
});


'use strict';

const Homey = require('homey');

class tibberWidgetApp extends Homey.App {

  async onInit() {
    this.log('Tibber Widget app is running...');
    // Init Debugger
    if (process.env.DEBUG === '1') {
      if (this.homey.platform == "local") {
        try {
          require('inspector').waitForDebugger();
        }
        catch (error) {
          require('inspector').open(9905, '0.0.0.0', true);
        }
      }
    }

    // Init App API
    this.log('Connecting to Tibber app API...');
    this.tibberAppApi = this.homey.api.getApiApp('com.tibber');
    this.tibberAppApi.on('realtime', async (event, data) => {
      // this.log('Tibber realtime event; ', event, ' Data: ', data);
      // send own realtime data to widgets
      if (event == 'data-update-event' && typeof data === 'object' && ( data.driverId === 'pulse' || data.driverId === 'home')) {
        data['tz'] = this.homey.clock.getTimezone();
        data['language'] = this.homey.i18n.getLanguage();

        await this.homey.api.realtime(event, data);
      }
    });

    // Init Widgets
    this.log('Init widgets...');
    await this._initWidgets();

  }

  // WIDGET Settings ==============================================================================
  async _initWidgets(){
    this.homey.dashboards.getWidget('price').registerSettingAutocompleteListener('device_home', async (query, settings) => { 
      try{
        return await this.tibberAppApi.get('/home-devices?name='+query, {});
      } catch (error) {
        throw new Error('Missing Tibber app version 1.10.0 or higher');
      }
    });
    this.homey.dashboards.getWidget('price').registerSettingAutocompleteListener('device_pulse', async (query, settings) => { 
      try{
        return await this.tibberAppApi.get('/pulse-devices?name='+query, {});
      } catch (error) {
        throw new Error('Missing Tibber app version 1.10.0 or higher');
      }
    });
  }
  
}
  
module.exports = tibberWidgetApp;
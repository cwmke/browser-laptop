/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* global describe, before, beforeEach, after, it */

const mockery = require('mockery')
const {mount} = require('enzyme')
const sinon = require('sinon')
const assert = require('assert')
const fakeElectron = require('../lib/fakeElectron')
let Preferences
require('../braveUnit')

describe('Preferences component', function () {
  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
    mockery.registerMock('../../less/switchControls.less', {})
    mockery.registerMock('../../less/about/preferences.less', {})
    mockery.registerMock('../../less/forms.less', {})
    mockery.registerMock('../../less/button.less', {})
    mockery.registerMock('../../node_modules/font-awesome/css/font-awesome.css', {})
    mockery.registerMock('../../extensions/brave/img/caret_down_grey.svg', 'caret_down_grey.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_general.svg', 'browser_prefs_general.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_search.svg', 'browser_prefs_search.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_tabs.svg', 'browser_prefs_tabs.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_plugins.svg', 'browser_prefs_plugins.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_security.svg', 'browser_prefs_security.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_shields.svg', 'browser_prefs_shields.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_payments.svg', 'browser_prefs_payments.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_sync.svg', 'browser_prefs_sync.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_advanced.svg', 'browser_prefs_advanced.svg')
    mockery.registerMock('../../../extensions/brave/img/ledger/verified_green_icon.svg')
    mockery.registerMock('../../../extensions/brave/img/ledger/verified_white_icon.svg')

    window.chrome = fakeElectron
    window.CustomEvent = {}

    Preferences = require('../../../js/about/preferences').AboutPreferences
  })
  after(function () {
    mockery.disable()
  })

  describe('loads', function () {
    before(function () {
      this.eventMap = {}
      sinon.stub(window, 'addEventListener', (event, cb) => {
        this.eventMap[event] = cb
      })
      window.CustomEvent = {}
      this.result = mount(Preferences)
    })

    beforeEach(function () {
      window.location.hash = ''
    })

    it('Changes pref pane on popstate event', function () {
      assert.equal(this.result.find('[data-l10n-id="generalSettings"]').length, 1)
      assert.equal(this.result.find('[data-l10n-id="searchSettings"]').length, 0)
      // emit a fake popstate event
      window.location.hash = 'search'
      this.eventMap.popstate()
      assert.equal(this.result.find('[data-l10n-id="generalSettings"]').length, 0)
      assert.equal(this.result.find('[data-l10n-id="searchSettings"]').length, 1)
    })

    it('Changes pref pane by hash on mount', function () {
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-l10n-id="generalSettings"]').length, 1)
      assert.equal(this.result.find('[data-l10n-id="searchSettings"]').length, 0)
      window.location.hash = 'search'
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-l10n-id="generalSettings"]').length, 0)
      assert.equal(this.result.find('[data-l10n-id="searchSettings"]').length, 1)
    })
  })
})

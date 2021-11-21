// import { addDomain } from './popup';
const popup = require('./popup')

test('add non-duplicate domain', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com'];
    popup.addDomain('google.com', whitelist);
    expect(whitelist).toContain('google.com');
});

test('add duplicate domain', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com'];
    popup.addDomain('facebook.com', whitelist);
    expect(whitelist).toHaveLength(3);
});

test('remove item', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com'];
    var updatedWhitelist = popup.removeItem('facebook.com', whitelist);
    expect(updatedWhitelist).not.toContain('facebook.com');
});

test('remove duplicate items', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com', 'facebook.com'];
    var updatedWhitelist = popup.removeItem('facebook.com', whitelist);
    expect(updatedWhitelist).not.toContain('facebook.com');
});

test('add list items - item count', () => {
    var items = ['facebook.com', 'twitter.com', 'meetup.com'];
    var added = popup.addListItems(items);
    expect(added).toHaveLength(3);
});

test('add list items - null list', () => {
    var items = null;
    var added = popup.addListItems(items);
    expect(added).toBeNull();
});

test('add list items - empty list', () => {
    var items = [];
    var added = popup.addListItems(items);
    expect(added).toHaveLength(0);
});

test('validate correct URL', () => {
    var url = "https://facebook.com";
    var validated = popup.validateUrl(url);
    expect(validated).toBeTruthy();
});

test('validate incorrect URL', () => {
    var url = "this was a fun project";
    var validated = popup.validateUrl(url);
    expect(validated).toBeFalsy();
});
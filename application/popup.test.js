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
})

test('remove item', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com'];
    var updatedWhitelist = popup.removeItem('facebook.com', whitelist);
    expect(updatedWhitelist).not.toContain('facebook.com');
})

test('remove duplicate items', () => {
    var whitelist = ['facebook.com', 'twitter.com', 'meetup.com', 'facebook.com'];
    var updatedWhitelist = popup.removeItem('facebook.com', whitelist);
    expect(updatedWhitelist).not.toContain('facebook.com');
})
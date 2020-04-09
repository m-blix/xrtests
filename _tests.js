// TESTS
let tests = [
{
  desc: '"<code>XRSystem</code>" object in <code>window</code> object',
  f: function() {
    return 'XRSystem' in window
  },
  expect: true
},
{
  desc: '"<code>XR</code>" object NOT in <code>window</code> object',
  f: function() {
    return 'XR' in window
  },
  expect: false
}
];

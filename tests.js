// TESTS
const TESTS = [
{
  desc: '"<code>XRSystem</code>" object in <code>window</code> object',
  f: function() {
    return 'XRSystem' in window;
  },
  expect: true
},
{
  desc: '"<code>XR</code>" object NOT in <code>window</code> object',
  f: function() {
    return 'XR' in window;
  },
  expect: false
},
{
  // "XRSystem"
  desc: 'All other XR objects in <code>window</code> object',
  f: function() {
    let objs = Object.getOwnPropertyNames(window).sort(function(a, b){ return a.length - b.length; });
    let xrObjs = objs.filter(function(a){ return a.startsWith('XR') });

    let requiredObs = [
      "XRPose", "XRView", "XRFrame", "XRSpace", "XRSession", "XRViewport", "XRViewerPose", 
      "XRWebGLLayer", "XRInputSource", "XRRenderState", "XRSessionEvent", "XRReferenceSpace", 
      "XRRigidTransform", "XRInputSourceArray", "XRInputSourceEvent", "XRReferenceSpaceEvent", 
      "XRBoundedReferenceSpace", "XRInputSourcesChangeEvent"];

    for (let i = 0; i < requiredObs.length; i++) {
      let prop = requiredObs[i];
      if (window[prop] === undefined) {
        return false;
      }
    }
    return true;
  },
  expect: true

}
];

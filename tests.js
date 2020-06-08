// TESTS
const TESTS = [
{
  desc: '<code>xr</code> in <code>navigator</code>; WebXR supported',
  f: function() {
    return 'xr' in navigator
  },
  expect: true
},
{
  desc: 'WebXR support by Feature Policy',
  ref: 'https://github.com/web-platform-tests/wpt/blob/master/webxr/webxr-supported-by-feature-policy.html',
  f: function() {
    var features = document.featurePolicy.features();
    return features.includes('xr-spatial-tracking');
  },
  expect: true
},
{
  desc: '"WebVR" API not present (deprecated)',
  f: function() {
    return 'getVRDisplays' in navigator;
  },
  expect: false
},
{
  desc: '<code>immersive-vr</code> XRSession supported',
  f: async function() {
    let supported = await navigator.xr.isSessionSupported('immersive-vr');
    return supported;
  },
  expect: true
},
{
  desc: '<code>immersive-ar</code> XRSession supported',
  f: async function() {
    let supported = await navigator.xr.isSessionSupported('immersive-ar');
    return supported;
  },
  expect: true
},
{
  desc: '<code>inline</code> XRSession supported',
  f: async function() {
    let supported = await navigator.xr.isSessionSupported('inline');
    return supported;
  },
  expect: true
},
{
  desc: '<code>immersive-ar</code> with <code>hit-test</code> XRSession supported',
  f: async function() {
    let options = {
      requiredFeatures: ['hit-test']
    }
    let supported = await navigator.xr.isSessionSupported('immersive-ar', options);
    return supported;

  },
  expect: true
},
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

    let requiredObjs = [
      "XRPose", "XRView", "XRFrame", "XRSpace", "XRSession", "XRViewport", "XRViewerPose",
      "XRWebGLLayer", "XRInputSource", "XRRenderState", "XRSessionEvent", "XRReferenceSpace",
      "XRRigidTransform", "XRInputSourceArray", "XRInputSourceEvent", "XRReferenceSpaceEvent",
      "XRBoundedReferenceSpace", "XRInputSourcesChangeEvent"];

    let hitTestObjs = [
      "XRRay", "XRHitTestResult", "XRHitTestSource",
      "XRTransientInputHitTestResult", "XRTransientInputHitTestSource"];

    requiredObjs = requiredObjs.concat(hitTestObjs);

    for (let i = 0; i < requiredObjs.length; i++) {
      let prop = requiredObjs[i];
      if (window[prop] === undefined) {
        console.log(`${prop} not in window`);
        return false;
      }
    }
    return true;
  },
  expect: true
},
{
  skip: true,
  requireUserActivation: true,
  desc: 'XRSession Blend Modes - VR',
  ref: 'https://github.com/web-platform-tests/wpt/blob/master/webxr/ar-module/xrSession_environmentBlendMode.https.html',
  f: async function() {
    var valid = ["opaque", "additive"];
    var session = await navigator.xr.requestSession('immersive-vr');
    var blendMode = session.environmentBlendMode;
    await session.end();
    return valid.includes(blendMode);
  },
  expect: true
},
{
  requireUserActivation: true,
  desc: 'XRSession Blend Modes - AR',
  ref: 'https://github.com/web-platform-tests/wpt/blob/master/webxr/ar-module/xrSession_environmentBlendMode.https.html',
  f: async function() {
    var valid = ["alpha-blend", "additive"];
    var session = await navigator.xr.requestSession('immersive-ar');
    var blendMode = session.environmentBlendMode;
    await session.end();
    return valid.includes(blendMode);
  },
  expect: true
},
{
  skip: true,
  requireUserActivation: true,
  desc: 'XRViews Tests - VR',
  ref: 'https://github.com/web-platform-tests/wpt/blob/master/webxr/xrView_match.https.html',
  f: async function() {
    return new Promise(async function(resolve){

      var success = true;
      var session = await navigator.xr.requestSession('immersive-vr');

      var viewerSpace = await session.requestReferenceSpace('viewer');

      async function onFrame(time, xrFrame) {
        let pose = xrFrame.getViewerPose(viewerSpace);

        if (pose.views.length !== 2) {
          success = false;
        }

        let leftView = pose.views[0];
        let rightView = pose.views[1];

        // Ensure that the views are the right type.
        if (!(leftView instanceof XRView)) {
          success = false;
        }
        if (!(rightView instanceof XRView)) {
          success = false;
        }

        // Ensure they have the expected projection matrices.
        if (leftView.projectionMatrix === null) {
          success = false;
        }
        if (rightView.projectionMatrix === null) {
          success = false;
        }

        await session.end();
        resolve(success);
      }

      session.requestAnimationFrame(onFrame);
    });

  },
  expect: true
},
{
  requireUserActivation: true,
  ref: 'https://github.com/web-platform-tests/wpt/blob/master/webxr/xrDevice_requestSession_immersive_unsupported.https.html',
  desc: '<code>XRSession</code> not supported options',
  f: async function(){
    try {
      var options = {
        requiredFeatures: ['dom-overlay']
      };
      var session = await navigator.xr.requestSession('immersive-ar', options);
    } catch (error) {
      console.log(error);
      return (error.name == 'NotSupportedError');
    }
    return false;
  },
  expect: true
},
{
  requireUserActivation: true,
  desc: 'AR <code>hit-test</code> with <code>HitTestSource</code>',
  f: async function() {
    let options = {
      requiredFeatures: ['hit-test']
    }
    let supported = await navigator.xr.isSessionSupported('immersive-ar', options);
    if (!supported) {
      console.log('session not supported');
      return supported;
    }
    let session = await navigator.xr.requestSession('immersive-ar', options);
    console.log('session created');
    let refSpace = await session.requestReferenceSpace('viewer');
    console.log('viewer referencespace created');
    let hitTestSource = await session.requestHitTestSource({ space: refSpace });
    console.log('hittestsource requested');
    await session.end();
    return (hitTestSource instanceof XRHitTestSource);
  },
  expect: true
},
{
  /* DOM Overlay, not supported yet */
  desc: '<code>immersive-ar</code> with <code>dom-overlay</code> XRSession not supported',
  f: async function() {
    let options = {
      requiredFeatures: ['dom-overlay']
    }
    let supported = await navigator.xr.isSessionSupported('immersive-ar', options);
    return supported;

  },
  expect: false
},
{
  /* Anchors, not supported yet */
  desc: '<code>immersive-ar</code> with <code>anchors</code> XRSession not supported',
  f: async function() {
    let options = {
      requiredFeatures: ['anchors']
    }
    let supported = await navigator.xr.isSessionSupported('immersive-ar', options);
    return supported;

  },
  expect: false
},
{
  desc: 'context creation with <code>makeXRCompatible</code> function',
  f: async function() {
    var webglCanvas = document.createElement('canvas');
    let gl = webglCanvas.getContext('webgl');

    let compat = await gl.makeXRCompatible();
    return gl.getContextAttributes().xrCompatible;
  },
  expect: true
},
];

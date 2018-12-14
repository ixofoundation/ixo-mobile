package com.ixo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.Map;
import java.util.HashMap;

import static com.ixo.BuildConfig.BUILD_VARIANT;

public class RNDeviceInfoModule extends ReactContextBaseJavaModule {
    public RNDeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNDeviceInfo";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("buildVariant", BUILD_VARIANT);
        return constants;
    }
}
package com.tontonstudio.quoicoubapp;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends Activity {
    private static final int PERMISSION_REQUEST_CODE = 100;
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Cacher la barre de titre
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        // Définir la mise en page
        setContentView(R.layout.activity_main);
        
        // Initialiser le WebView
        webView = findViewById(R.id.webview);
        
        // Demander les permissions si nécessaire
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.RECORD_AUDIO},
                        PERMISSION_REQUEST_CODE);
            } else {
                configureWebView();
            }
        } else {
            configureWebView();
        }
    }
    
    private void configureWebView() {
        // Configurer les paramètres de WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        
        // Gérer les requêtes de permission (pour le microphone)
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }
        });
        
        // Empêcher les liens externes d'ouvrir un navigateur
        webView.setWebViewClient(new WebViewClient());
        
        // Charger l'application web locale
        webView.loadUrl("file:///android_asset/www/index.html");
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                configureWebView();
            }
        }
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}

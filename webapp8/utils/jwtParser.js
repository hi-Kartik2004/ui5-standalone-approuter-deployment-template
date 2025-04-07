sap.ui.define([
    "sap/ui/base/ManagedObject"
], function (
    ManagedObject
) {
    "use strict";

    return function (token) {
        if (!token) {
            console.error('JWT token not presnent');
            return;
        }
        try {
            // Split the token into its three parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('JWT must have 3 parts');
            }

            // The payload is the second part of the token
            const encodedPayload = parts[1];

            // Replace URL-safe characters
            const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');

            // Decode Base64 data
            const payload = JSON.parse(window.atob(base64));

            return payload;
        } catch (error) {
            console.error('Failed to parse JWT:', error);
            return null;
        }
    }
});
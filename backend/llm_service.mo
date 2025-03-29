import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Http "mo:base/Http";

actor LLMService {
    // Types
    public type Error = {
        #InvalidInput;
        #ServiceError;
        #RateLimitExceeded;
    };

    public type Result<T> = Result.Result<T, Error>;

    // Configuration
    private let MAX_REQUESTS_PER_MINUTE = 60;
    private let API_KEY = "Bearer AIzaSyCgWwqfJL1r1op3JBKGM7ctzgAbMGKllak"; // Ganti dengan API Key Gemini
    private let API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=YOUR_GEMINI_API_KEY"; 

    // Rate limiting
    private type RateLimit = {
        count: Nat;
        timestamp: Nat;
    };

    private let rateLimits = HashMap.HashMap<Principal, RateLimit>(0, Principal.equal, Principal.hash);

    // Helper functions
    private func getCurrentTimestamp() : Nat {
        Int.abs(Time.now())
    };

    private func checkRateLimit(principal: Principal) : Bool {
        let now = getCurrentTimestamp();
        switch (rateLimits.get(principal)) {
            case (?limit) {
                if (now - limit.timestamp > 60) {
                    rateLimits.put(principal, { count = 1; timestamp = now });
                    true
                } else if (limit.count >= MAX_REQUESTS_PER_MINUTE) {
                    false
                } else {
                    rateLimits.put(principal, { count = limit.count + 1; timestamp = limit.timestamp });
                    true
                }
            };
            case null {
                rateLimits.put(principal, { count = 1; timestamp = now });
                true
            };
        };
    };

    // 🔹 Fungsi untuk menganalisis gambar makanan dengan Google Gemini
    public shared(msg) func analyzeImage(imageBase64: Text) : async Result<Text> {
        if (not checkRateLimit(msg.caller)) {
            return #err(#RateLimitExceeded);
        };

        let payload = "{ \"contents\": [{ \"parts\": [{ \"text\": \"Analyze this food image.\", \"inlineData\": { \"mimeType\": \"image/jpeg\", \"data\": \"" # imageBase64 # "\" } }] }] }";

        let headers = [
            ("Authorization", API_KEY),
            ("Content-Type", "application/json")
        ];

        let request = {
            url = API_URL;
            method = #post;
            body = ?Blob.fromArray(Text.encodeUtf8(payload));
            headers = headers;
        };

        let response = await Http.fetch(request);

        switch (response.body) {
            case (?body) {
                let decoded = Text.decodeUtf8(Blob.toArray(body));
                switch (decoded) {
                    case (?text) { return #ok(text); };
                    case null { return #err(#ServiceError); };
                }
            };
            case null { return #err(#ServiceError); };
        };
    };

    // Health check endpoint
    public shared(msg) func healthCheck() : async Bool {
        true
    };
};

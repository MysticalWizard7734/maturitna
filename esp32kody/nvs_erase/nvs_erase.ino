// this erases the NVS of the esp, all data in preferences will be deleted
#include <Preferences.h>
#include <nvs_flash.h>

Preferences preferences;

void setup() {
    Serial.begin(115200);

    // Initialize NVS
    esp_err_t err = nvs_flash_init();
    if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        // NVS partition was truncated and needs to be erased
        ESP_ERROR_CHECK(nvs_flash_erase());
        err = nvs_flash_init();
    }
    ESP_ERROR_CHECK(err);

    // Erase all preferences
    Serial.println("Erasing all preferences...");
    ESP_ERROR_CHECK(nvs_flash_erase());

    // Re-initialize NVS
    ESP_ERROR_CHECK(nvs_flash_init());
}

void loop() {

}
# iot-fukkatsu

Kawamoto Sensei's Raspberry Pi Weather Station Restoration

## Overview

This project aims to restore and modernize a Raspberry Pi-based weather station originally built by Kawamoto Sensei. The system collects environmental data (such as temperature, humidity, and pressure) using various sensors and uploads the data to the cloud for visualization and analysis.

## Features

- Sensor data collection (temperature, humidity, pressure, etc.)
- Data logging and local storage
- Cloud upload (Google Sheets, Firebase, or other platforms)
- Web dashboard for real-time and historical data visualization
- Easy setup and configuration
- Modular code for adding new sensors

## Hardware Requirements

- Raspberry Pi (any model with GPIO support)
- DHT22 or DHT11 (temperature/humidity sensor)
- BMP180/BMP280 (barometric pressure sensor)
- (Optional) Other I2C/SPI sensors
- Internet connection (Wi-Fi or Ethernet)

## Software Requirements

- Raspberry Pi OS (or compatible Linux distro)
- Python 3.x
- pip (Python package manager)
- Required Python libraries (see below)

## Setup

1. **Clone this repository:**
   ```sh
   git clone https://github.com/luqhardy/iot-fukkatsu.git
   cd iot-fukkatsu
   ```
2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
3. **Connect sensors:**
   - Wire up the DHT22/DHT11 and BMP180/BMP280 sensors to the Raspberry Pi GPIO pins as described in the hardware documentation.
4. **Configure cloud upload:**
   - Edit `config.py` or the relevant config file to add your cloud credentials (Google Sheets API, Firebase, etc.).
5. **Run the main script:**
   ```sh
   python main.py
   ```

## Usage

- The script will collect sensor data at regular intervals and upload it to the configured cloud service.
- Data can be viewed on the web dashboard or directly in the cloud platform.

## Project Structure

```
iot-fukkatsu/
  ├── main.py           # Main script for data collection and upload
  ├── sensors.py        # Sensor interface code
  ├── config.py         # Configuration (API keys, intervals, etc.)
  ├── requirements.txt  # Python dependencies
  ├── dashboard/        # (Optional) Web dashboard code
  └── ...
```

## Credits

- Original project by Kawamoto Sensei
- Restoration and modernization by Luqman Hardy

## License

MIT

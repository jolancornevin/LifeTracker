run:
	npm run start

build:
	eas build -p android --profile preview

emul:
	D:\Users\hp\AppData\Local\Android\sdk1/emulator/emulator @Pixel_6_API_33 -avd Resizable_Experimental_API_33
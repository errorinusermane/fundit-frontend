npx react-native doctor

# 폴더 이동해서 init
cd /Users/susie/Desktop/Temp_Laptop3/Solidity_Files/Yn
npx @react-native-community/cli init MyMacOSApp --version 0.73.6
cd MyMacOSApp
npx react-native-macos-init --version 0.73.15

# 이제까지 계속 오류나던 것 중에 그나마 했던 거
0. (그 전에 한 거) 자바 17로 맞추기, extension 전부 다시 깔기
1. .zshrc 파일 겹치는 것 없이 완벽 수정
2. .zprofile 파일 겹치는 것 없이 완벽 수정
3. vs code 내 code ~/Library/Application\ Support/Code/User/settings.json 이용해서 안에 터미널 오류 나는 거 전부 수정
4. 프로젝트 밀고 다시 할 때 공식문서 참고...
https://microsoft.github.io/react-native-windows/docs/rnm-getting-started
...해서, 프로젝트 init 시 --version 0.73.6 붙여서 하고, macos init도 함께 함. (pod은 중간에 설치 안 했음)
5. 하다가 오류나서 ruby, cocoapod 다시 깖 <- 이게 도움이 된 것 같음!!

# 이거 아래 한 줄로 바로 전체 실행됨!!! 막 터미널 여러 개 켤 필요 없음!!!
npx react-native run-android

# 에뮬레이터 한번 켜고 해야함
emulator -list-avds
emulator -avd Pixel_5

# ================================================= #

# 오류날 때
rm -rf node_modules
rm -rf yarn.lock package-lock.json
rm -rf /tmp/metro-*
watchman watch-del-all || true
rm -rf android/.gradle
rm -rf android/app/build
rm -rf android/build

npm install

npx react-native start --reset-cache

# 오류날 때 2
watchman watch-del-all || true
killall -9 node || true
adb uninstall com.fundit_dapp_frontend || true

rm -rf node_modules android/.gradle android/app/build
npm i

cd android && ./gradlew clean && cd ..

npx react-native start --reset-cache

# 오류날 때 3
cd android
./gradlew clean
cd ..
npx react-native run-android

# ================================================= #

1. 네비게이션을 하려고 함.
2. 네비게이션 관련 패키지 깔려면 npm ls react-native-reanimated react-native-worklets 이런 게 있어야 함
3. 이걸 쓰려면 babel에 plugins: ['react-native-reanimated/plugin'],를 넣어야 함
4. 3을 하려면 fundit_frontend % npm install --save-dev metro-react-native-babel-preset가 필요함
5. 4를 하려면 index.js 최상단에 import 'react-native-gesture-handler';를 해야함. 그럼 바로 500오류 발생.
=> 해결: 패키지를 다시 깔고? 무슨 npm i 써서 깔고 + index는 최상단에 그거 두고 + app.tsx에서 아래 두 가지를 써줌.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
=> 해결 안 됨!

=> 결국 문제가 정확히 reanimated 같은 의존성(네비게이션 관련 의존성?)과 내가 리액트 네이티브 깐 버전 0.73.6을 지원하지 않아서! 가 문제임을 깨닫.
=> 리액트 네이티브 0.75.0부터 지원한다고 해서 이걸로 하기로 결정.

cd /Users/susie/Desktop/Temp_Laptop3/Solidity_Files/Yn
npx @react-native-community/cli init fundit_frontend --version 0.75.0
cd fundit_frontend
npx react-native-macos-init --version 0.75.33


npm i react-native-gesture-handler@2.15.0 \
      react-native-screens@^4.13.1 \
      react-native-safe-area-context@^4.10.5

=> 2.15.0으로 맞추기.

# .env 관련
- ts config에 넣지 말고,
- types/env.d.ts에 정의하는 게 훨씬 더 깔끔함

# 타입 관련
- 놀랍게도 @가 적용이 안 돼서,
- 그냥 전부 ../ 로 하는 걸로 ^^ 제발...

# ================================================= #

# 진심 일주일 삽질한 후기
1. 생각보다 바꿀 게 몇 개 없음. 일단 android 안에 있는 모-----든 거 안 건드려도 됨.
2. 심지어 ts config도 안 바꿨음.
3. babel만 바꿨음. 근데 둘다(네비게이션, .env) 됐음.
4. 이 모든 영광을 스택오버플로우에 돌립니다. 10일+a의 삽질은 모두 
5. 가장 중요한 거: 챗지피티는 졸라 바보다. 결국 개발환경 전부 내가 어느 정도 알고 있어야 함. 컴파일이 어떤 파일 순서로 되는지 알고 있어야 함. 진짜 이건 필수임...
6. 그리고 또 중요한 거: 진짜 아무리 해도(한 이틀 내내 해도) 안 될 때는, 1) 설정 파일 공부하기 2) 스택 오버플로우 검색하기 3) 가장 문제가 되는 곳을 일단 찾고(이것도 어려움), 프로젝트 init해서 그것만!!!!(이번의 경우 네비게이션, .env) 조정해보기. 그럼 진심 100% 다 됨. 안 되는 게 없다.
- 이상 챗지피티 믿었다가 졸라 배신당한 사람 -
- 와... 6번만 해서 한 지 30분 만에 바로 됐음... 하 ^^ -

# ================================================= #

IP 확인
ipconfig getifaddr en0

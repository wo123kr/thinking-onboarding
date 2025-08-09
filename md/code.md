JavaScript, iOS, Android, Unity, Unreal, Restful API 에 대한 내용 부분

-----
# Java Script 
# 1. SDK 통합

## 1.1 자동 통합

`npm`을 사용하여 SDK를 설치합니다.

```sh
npm install thinkingdata-browser --save
```

다음으로 SDK를 초기화합니다. 구체적인 구성 파라미터는 아래 코드를 참조해 주세요.

```javascript
import thinkingdata from "thinkingdata-browser";

var config = {
    appId: "APP_ID",
    serverUrl: "https://YOUR_SERVER_URL",
    // batch: true, // 데이터를 먼저 로컬에 캐시한 후 일괄 전송합니다. 기본값은 false입니다.
    autoTrack: {
        pageShow: true, // 페이지 표시 이벤트를 활성화합니다. 이벤트 이름: ta_page_show
        pageHide: true, // 페이지 숨김 이벤트를 활성화합니다. 이벤트 이름: ta_page_hide
    }
};

thinkingdata.init(config);
```

## 1.2 수동 통합

**단계 1: JavaScript SDK 다운로드**
압축 파일에는 두 가지 규격의 스크립트가 제공됩니다. 필요에 따라 원하는 스크립트를 선택할 수 있습니다.

  * **비동기 로딩:** `thinkingdata.min.js` 파일 사용
  * **동기 로딩:** `thinkingdata.umd.min.js` 파일 사용

**단계 2: JavaScript SDK 로딩**
SDK를 비동기 또는 동기 로딩 방식으로 사용할 수 있으며, 둘 중 하나를 선택하면 됩니다.

**초기화 구성 파라미터:**

  * **`appId`**: 프로젝트의 APP\_ID로, TE 프로젝트 관리 페이지에서 확인할 수 있습니다.
  * **`serverUrl`**: 데이터 전송 URL
      * **SaaS(클라우드 서비스) 사용자:** 프로젝트 관리 → 프로젝트 설정 → 구성에서 데이터 전송 주소를 확인하세요.
      * **프라이빗(온프레미스) 배포 사용자:** 데이터 전송 주소를 직접 설정할 수 있습니다.

### 비동기 로딩

비동기 로딩의 경우 `thinkingdata.min.js`를 사용하며, 아래 코드를 HTML의 `<head>` 또는 기타 초기화 코드에 삽입하고 해당 파라미터를 설정하세요.

```html
<script>
    !function (e) { if (!window.ThinkingDataAnalyticalTool) { var n = e.sdkUrl, t = e.name, r = window, a = document, i = "script", l = null, s = null; r.ThinkingDataAnalyticalTool = t; var o = ["track", "quick", "login", "identify", "logout", "trackLink", "userSet", "userSetOnce", "userAdd", "userDel", "setPageProperty", "setSuperProperties", "setDynamicSuperProperties", "clearSuperProperties", "timeEvent", "unsetSuperProperties", "initInstance", "trackFirstEvent", "trackUpdate", "trackOverwrite"]; r[t] = function (e) { return function () { if (this.name) (r[t]._q = r[t]._q || []).push([e, arguments, this.name]); else if ("initInstance" === e) { var n = arguments[0]; r[t][n] = { name: n }; for (var a = 0; a < o.length; a++)r[t][n][o[a]] = r[t].call(r[t][n], o[a]); (r[t]._q1 = r[t]._q1 || []).push([e, arguments]) } else (r[t]._q = r[t]._q || []).push([e, arguments]) } }; for (var u = 0; u < o.length; u++)r[t][o[u]] = r[t].call(null, o[u]); r[t].param = e, r[t].__SV = 1.1, l = a.createElement(i), s = a.getElementsByTagName(i)[0], l.async = 1, l.src = n, s.parentNode.insertBefore(l, s) } }(
    {
        appId: 'APP_ID', // 시스템에서 할당된 APPID
        name: 'ta', // 전역 호출 변수명, 임의로 설정 가능하며 이후 호출 시 이 이름을 사용
        sdkUrl: './thinkingdata.min.js', // 통계 스크립트 URL
        serverUrl: 'https://YOUR_SERVER_URL/sync_js', // 데이터 전송 URL
        // batch: true, // 데이터를 먼저 로컬에 캐시한 후 일괄 전송합니다. 기본값은 false입니다.  
        autoTrack: {
           pageShow: true, // 페이지 표시 이벤트를 활성화합니다. 이벤트 이름: ta_page_show
           pageHide: true, // 페이지 숨김 이벤트를 활성화합니다. 이벤트 이름: ta_page_hide
        },
        loaded: function(ta) {
           // var currentId = ta.getDistinctId();
           // ta.identify(currentId);
           // ta.quick('autoTrack');
        }
    });
</script>
```

### 동기 로딩

동기 로딩의 경우 `thinkingdata.umd.min.js`를 사용하며, 아래 코드를 초기화 코드에 삽입하고 해당 파라미터를 설정하세요:

```html
<script src="./thinkingdata.umd.min.js"></script>
<script>
// SDK 구성 객체 생성
var config = {
    appId: 'APP_ID',
    serverUrl: 'https://YOUR_SERVER_URL/sync_js',
    // batch: true, // 데이터를 먼저 로컬에 캐시한 후 일괄 전송합니다. 기본값은 false입니다.
    autoTrack: {
     pageShow: true, // 페이지 표시 이벤트를 활성화합니다. 이벤트 이름: ta_page_show
     pageHide: true, // 페이지 숨김 이벤트를 활성화합니다. 이벤트 이름: ta_page_hide
    }
};

// SDK 인스턴스를 전역 변수 ta 또는 원하는 변수에 할당
window.ta = thinkingdata;

// 구성 객체로 SDK 초기화
ta.init(config);
</script>
```

**비동기 로딩 고유 파라미터 설명:**

  * **`name`**: 전역 호출 변수명입니다.
  * **`sdkUrl`**: SDK의 URL로, 반드시 설정해야 합니다.
  * **`loaded`**: 초기화 콜백 함수입니다. SDK 로딩이 완료된 후, 데이터 전송 시작 전에 호출됩니다. 예를 들어, 여기서 유저 ID를 설정하면 SDK 로딩 전에 생성된 데이터에도 해당 유저 ID가 설정됩니다.

-----

# 2\. 주요 기능

기본 기능을 사용하기 전에, 먼저 **유저 식별 규칙**을 이해하는 것이 좋습니다. SDK는 기본적으로 랜덤값을 생성하여 게스트 ID로 사용하며, 유저가 로그인하기 전까지는 이 게스트 ID가 식별 ID로 사용됩니다.

## 2.1 계정 ID 설정

유저가 로그인할 때 `login`을 호출하여 계정 ID를 설정할 수 있습니다. TE 플랫폼은 이 계정 ID를 식별 ID로 사용하며, `logout`을 호출하기 전까지 유지됩니다. `login`을 여러 번 호출하면 이전 계정 ID는 덮어쓰입니다.

```javascript
// 유저의 로그인 고유 식별자, 이 데이터는 전송 데이터의 #account_id에 해당하며, 이때 #account_id 값은 TA입니다.
ta.login("TA");
```

> **참고:** 이 메서드는 로그인 이벤트를 전송하지 않습니다.

## 2.2 공통 이벤트 속성 설정

공통 이벤트 속성은 **모든 이벤트에 자동으로 포함되는 속성**을 의미합니다. `setSuperProperties`를 호출하여 설정할 수 있으며, 이벤트 전송 전에 미리 설정하는 것을 권장합니다.
예를 들어, 유저의 회원 등급, 유입 채널 등 중요한 속성을 공통 이벤트 속성으로 설정하면 모든 이벤트에 자동으로 포함됩니다.

```javascript
var superProperties = {};
superProperties["channel"] = "ta"; // String
superProperties["age"] = 1; // Number
superProperties["isSuccess"] = true; // Boolean
superProperties["birthday"] = new Date(); // Date
superProperties["object"] = {key: "value"}; // Object
superProperties["object_arr"] = [{key: "value"}]; // Object array
superProperties["arr"] = ["value"]; // Array

ta.setSuperProperties(superProperties); // 공통 이벤트 속성 설정
```

  * 공통 이벤트 속성은 캐시에 저장되므로 앱을 다시 실행할 때마다 설정할 필요가 없습니다.
  * 이미 설정된 속성을 다시 설정하면 기존 값이 **덮어쓰기(업데이트)** 됩니다.
  * **Key (속성명):**
      * 문자열 타입이며 영문자로 시작해야 합니다.
      * 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
      * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다 (TE 시스템에서 자동으로 소문자로 변환).
  * **Value (속성값):**
      * String, Number, Boolean, Date, Object, Object Array, Array 타입을 지원합니다.

## 2.3 이벤트 전송

`track`을 호출하여 이벤트를 전송할 수 있습니다. 데이터 플랜을 미리 준비한 후 이벤트를 전송하세요.

```javascript
// 아이템 구매 이벤트 전송 예시
ta.track(
    "product_buy", // 이벤트 이름
    { product_name: "상품명" } // 이벤트 속성
);
```

  * **이벤트 이름 규칙:**
      * 문자열 타입이어야 합니다.
      * 영문자로 시작해야 하며, 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
      * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다.
  * **타입 지원:**
      * **Array(배열)**: SDK v1.6.0 이상, TE 플랫폼 v2.5 이상에서 지원합니다.
      * **Object(객체)**: TE 플랫폼 v3.5 이상에서 지원합니다.

## 2.4 유저 속성 설정

유저 속성을 설정하려면 `userSet` 메서드를 호출합니다.

  * 이 메서드를 사용하면 기존 속성 값이 **덮어쓰기(업데이트)** 됩니다.
  * 만약 해당 유저 속성이 기존에 없었다면, **새로운 속성으로 추가**됩니다.
  * 속성 타입은 전달된 값과 동일하게 저장됩니다.

<!-- end list -->

```javascript
// username 속성을 "TA"로 설정
ta.userSet({ username: "TA" });

// username 속성을 "TE"로 덮어쓰기
ta.userSet({ username: "TE" });
```

-----

# 3\. 코드 예시

다음 예제 코드는 앞서 설명한 모든 기능을 포함하고 있으며, 아래 순서대로 코드를 구성하는 것을 권장합니다.

```javascript
import thinkingdata from "thinkingdata-browser";

var config = {
    appId: "APP_ID",
    serverUrl: "https://YOUR_SERVER_URL/sync_js",
    // batch: true, // 데이터를 먼저 로컬에 캐시한 후 일괄 전송합니다. 기본값은 false입니다.
    autoTrack: {
        pageShow: true, // 활성화 시 페이지 표시 이벤트가 트래킹됩니다. 이벤트 이름: ta_page_show
        pageHide: true, // 활성화 시 페이지 숨김 이벤트가 트래킹됩니다. 이벤트 이름: ta_page_hide
    }
};

window.ta = thinkingdata;

// 1. SDK 초기화
ta.init(config);

// 2. 유저가 로그인한 경우, 계정 ID를 고유 식별자로 설정할 수 있습니다.
ta.login("TA");

// 3. 공통 이벤트 속성 설정
var superProperties = {};
superProperties["channel"] = "ta"; // string
superProperties["age"] = 1; // number
superProperties["isSuccess"] = true; // boolean
superProperties["birthday"] = new Date(); // date
superProperties["object"] = {key: "value"}; // object
superProperties["object_arr"] = [{key: "value"}]; // object array
superProperties["arr"] = ["value"]; // array
ta.setSuperProperties(superProperties); // 공통 이벤트 속성 설정

// 4. 이벤트 전송
ta.track(
    "product_buy", // event name
    {product_name: "상품 이름"} // event properties
);

// 5. 유저 속성 설정
ta.userSet({username: "TA"});
```

# iOS
# 1\. SDK 통합

## 1.1 자동 통합 (CocoaPods)

### 1\. Podfile 생성 및 편집

`Podfile`이 없다면 프로젝트(`.xcodeproj`) 파일과 같은 디렉토리에서 아래 명령어로 생성합니다.

```sh
pod init
```

`Podfile` 내용을 아래와 같이 편집합니다.

```ruby
platform :ios, '9.0'

target 'YourProjectTarget' do
  pod 'ThinkingSDK', '3.0.6'  #ThinkingSDK
end
```

### 2\. SDK 설치

프로젝트 루트 디렉토리에서 다음 명령을 실행하여 설치합니다.

```sh
pod install
```

설치가 성공하면 터미널에 관련 메시지가 표시됩니다.

### 3\. 워크스페이스 열기

명령 실행 후 `.xcworkspace` 파일이 생성되면 SDK 임포트가 완료된 것입니다. 이제부터는 `.xcworkspace` 파일을 열어서 프로젝트를 진행해야 합니다. (주의: `.xcodeproj` 파일을 동시에 열지 마세요.)

## 1.2 수동 통합

1.  **iOS SDK 다운로드 및 압축 해제**

2.  **`ThinkingSDK.framework` 파일을 Xcode 프로젝트 워크스페이스로 이동**

3.  **Linker Flags 설정**

      * Xcode에서 **`Targets`** → **`Build Settings`** 메뉴로 이동합니다.
      * **`Other linker flags`** 옵션에 \*\*`-ObjC`\*\*를 추가합니다.

    \<br\>
    \<img src="[https://assets.thinkingdata.cn/td-doc/assets/uploads/2022/08/19163013/WX20220819-162923.png](https://www.google.com/search?q=https://assets.thinkingdata.cn/td-doc/assets/uploads/2022/08/19163013/WX20220819-162923.png)" alt="Linker Flags 설정" width="600"/\>
    \<br\>

4.  **필수 라이브러리 추가**

      * Xcode에서 **`Targets`** → **`Build Phases`** 메뉴로 이동합니다.
      * \*\*`Link Binary With Libraries`\*\*에 다음 의존 항목들을 추가합니다.
          * `libz.dylib`
          * `Security.framework`
          * `SystemConfiguration.framework`
          * `libsqlite3.tbd`

-----

# 2\. SDK 초기화

SDK는 반드시 메인 스레드에서 초기화해야 합니다.

#### (Objective-C)

```objectivec
#import <ThinkingSDK/ThinkingSDK.h>

// SDK는 반드시 메인 스레드에서 초기화해야 합니다.
NSString *appid = @"APPID";
NSString *url = @"SERVER_URL";
    
// 첫 번째 방법
// [TDAnalytics startAnalyticsWithAppId:appid serverUrl:url];

// 두 번째 방법 (권장)
TDConfig *config = [[TDConfig alloc] init];
config.appid = appid;
config.serverUrl = url;
[TDAnalytics startAnalyticsWithConfig:config];
```

#### (Swift)

```swift
import ThinkingSDK

// SDK는 반드시 메인 스레드에서 초기화해야 합니다.
let appid = "APPID"
let url = "SERVER_URL"

// 첫 번째 방법
// TDAnalytics.start(withAppId: appid, serverUrl: url)

// 두 번째 방법 (권장)
let config = TDConfig(appId: appid, serverUrl: url)
TDAnalytics.start(with: config)
```

**파라미터 설명:**

  * **`APPID`**: 프로젝트의 APPID로, TE 프로젝트 관리 페이지에서 확인할 수 있습니다.
  * **`SERVER_URL`**: 데이터 전송 URL
      * **SaaS(클라우드 서비스)**: 프로젝트 관리 → 프로젝트 설정 → 구성에서 데이터 전송 주소를 확인하세요.
      * **프라이빗(온프레미스) 배포**: 데이터 전송 주소를 직접 설정할 수 있습니다.

-----

# 3\. 주요 기능

기본 기능 사용 전, **유저 식별 규칙**을 먼저 이해하는 것이 좋습니다. SDK는 기본적으로 랜덤값을 게스트 ID로 생성하여 사용하며, 유저가 로그인하기 전까지 이 ID가 식별자로 사용됩니다.

## 3.1 계정 ID 설정

유저가 로그인할 때 `login`을 호출하여 계정 ID를 설정합니다. TE 플랫폼은 이 ID를 식별자로 사용하며, `logout`을 호출하기 전까지 유지됩니다. `login`을 여러 번 호출하면 이전 ID는 덮어쓰입니다.

#### (Objective-C)

```objectivec
// 유저의 로그인 고유 식별자, 데이터의 #account_id에 해당합니다.
[TDAnalytics login:@"TD"];
```

#### (Swift)

```swift
// 유저의 로그인 고유 식별자, 데이터의 #account_id에 해당합니다.
TDAnalytics.login("TD")
```

> **참고**: 이 메서드는 로그인 이벤트를 전송하지 않습니다.

## 3.2 공통 이벤트 속성 설정

`setSuperProperties`를 호출하여 모든 이벤트에 포함될 공통 속성을 설정할 수 있습니다. 이벤트 전송 전에 미리 설정하는 것을 권장합니다.

#### (Objective-C)

```objectivec
NSDictionary *superProperties = @{
    @"channel": @"ta",
    @"age": @1,
    @"isSuccess": @YES,
    @"birthday": [NSDate date],
    @"object": @{ @"key":@"value" },
    @"object_arr": @[ @{ @"key":@"value" } ],
    @"arr": @[@"value"],
};
[TDAnalytics setSuperProperties:superProperties];
```

#### (Swift)

```swift
var superProperties: [AnyHashable : Any] = [:]
superProperties["channel"] = "te" // string
superProperties["age"] = 1 // number
superProperties["isSuccess"] = true // boolean
superProperties["birthday"] = Date() // date
superProperties["object"] = [ "key": "value" ] // object
superProperties["object_arr"] = [["key": "value"]] // object array
superProperties["arr"] = ["value"] // array

// 공통 이벤트 속성 설정
TDAnalytics.setSuperProperties(superProperties)
```

**속성 규칙:**

  * 공통 속성은 캐시에 저장되므로 앱 실행 시마다 설정할 필요가 없으며, 재설정 시에는 이전 값을 덮어씁니다.
  * **Key (속성 이름)**
      * `String` 타입
      * 알파벳으로 시작하며, 숫자, 알파벳, 밑줄(`_`) 포함 가능
      * 최대 길이: 50자 (대소문자 구분 없이 소문자로 자동 변환)
  * **Value (속성 값)**
      * 지원 타입: `String`, `Number`, `Boolean`, `Date`, `Dictionary`, `Array of Dictionaries`, `Array`
      * **Boolean 값 설정 시 주의**: `@YES`, `@NO`, `[NSNumber numberWithBool:YES]` 형식만 사용 가능 (`@true`, `@false` 등은 사용 불가).

## 3.3 자동 수집 활성화

클라이언트 SDK는 앱 설치, 실행, 종료 등의 이벤트를 자동으로 수집할 수 있습니다.

#### (Objective-C)

```objectivec
// 자동 수집 이벤트 활성화 (앱 설치, 실행, 종료 이벤트)
[TDAnalytics enableAutoTrack:TDAutoTrackEventTypeAppInstall | TDAutoTrackEventTypeAppStart | TDAutoTrackEventTypeAppEnd];
```

#### (Swift)

```swift
// 자동 수집 이벤트 활성화 (앱 설치, 실행, 종료 이벤트)
TDAnalytics.enableAutoTrack([.appStart, .appEnd, .appInstall])
```

## 3.4 이벤트 전송

`track` 메서드를 호출하여 이벤트를 전송합니다.

#### (Objective-C)

```objectivec
NSDictionary *eventProperties = @{@"product_name": @"book"};
[TDAnalytics track:@"product_buy" properties:eventProperties];
```

#### (Swift)

```swift
let properties = ["product_name": "book"] as [String: Any]
TDAnalytics.track("product_buy", properties: properties)
```

**이벤트 이름 규칙:**

  * `String` 타입
  * 알파벳으로 시작하며, 숫자, 알파벳, 밑줄(`_`) 포함 가능
  * 최대 길이: 50자 (대소문자 구분 없음)

## 3.5 유저 속성 설정

`userSet` 메서드를 호출하여 유저 속성을 설정합니다.

  * 기존 속성 값이 있으면 **덮어쓰기(업데이트)** 됩니다.
  * 기존 속성이 없으면 **새로운 속성으로 추가**됩니다.

#### (Objective-C)

```objectivec
// "username"을 "ThinkingData"로 설정
[TDAnalytics userSet:@{@"username": @"ThinkingData"}];

// "username"을 "TA"로 덮어쓰기
[TDAnalytics userSet:@{@"username": @"TA"}];
```

#### (Swift)

```swift
// "username"을 "ThinkingData"로 설정
TDAnalytics.userSet(["username": "ThinkingData"])

// "username"을 "TA"로 덮어쓰기
TDAnalytics.userSet(["username": "TA"])
```

-----

# 4\. 코드 예시

다음은 설명된 모든 기능을 포함하는 예제 코드입니다.

#### (Objective-C)

```objectivec
// 유저가 개인정보 보호 정책에 동의한 경우
if (userAgreedPrivacyPolicy) {
    // 로그 활성화 설정
    [TDAnalytics enableLog:NO];

    // 1. SDK 초기화 (메인 스레드에서)
    NSString *appid = @"APPID";
    NSString *url = @"SERVER_URL";
    TDConfig *config = [[TDConfig alloc] init];
    config.appid = appid;
    config.serverUrl = url;
    [TDAnalytics startAnalyticsWithConfig:config];

    // 2. 자동 수집 이벤트 활성화 (앱 설치, 실행, 종료)
    [TDAnalytics enableAutoTrack:TDAutoTrackEventTypeAppInstall | TDAutoTrackEventTypeAppStart | TDAutoTrackEventTypeAppEnd];

    // 3. 유저 로그인
    [TDAnalytics login:@"TD"];

    // 4. 공통 이벤트 속성 설정
    NSDictionary *superProperties = @{
        @"channel": @"ta",
        @"age": @1,
        @"isSuccess": @YES,
        @"birthday": [NSDate date],
        @"object": @{ @"key": @"value" },
        @"object_arr": @[ @{ @"key": @"value" } ],
        @"arr": @[@"value"],
    };
    [TDAnalytics setSuperProperties:superProperties];

    // 5. 이벤트 추적 (상품 구매)
    NSDictionary *eventProperties = @{@"product_name": @"book"};
    [TDAnalytics track:@"product_buy" properties:eventProperties];

    // 6. 유저 속성 설정
    [TDAnalytics userSet:@{@"username": @"ThinkingData"}];
}
```

#### (Swift)

```swift
TDAnalytics.enableLog(true)

// 1. SDK 초기화 (메인 스레드에서)
let appid = "app_id"
let url = "server_url"
let config = TDConfig(appId: appid, serverUrl: url)
TDAnalytics.start(with: config)

// 2. 자동 수집 이벤트 활성화 (앱 설치, 실행, 종료)
TDAnalytics.enableAutoTrack([.appStart, .appEnd, .appInstall])

// 3. 유저 로그인
TDAnalytics.login("TD")

// 4. 공통 이벤트 속성 설정
var superProperties: [AnyHashable : Any] = [:]
superProperties["channel"] = "ta"
superProperties["age"] = 1
superProperties["isSuccess"] = true
superProperties["birthday"] = Date()
superProperties["object"] = [ "key": "value" ]
superProperties["object_arr"] = [["key": "value"]]
superProperties["arr"] = ["value"]
TDAnalytics.setSuperProperties(superProperties)

// 5. 이벤트 추적
let eventProperties : [String: Any] = ["product_name": "book"]
TDAnalytics.track("product_buy", properties: eventProperties)

// 6. 유저 속성 설정
TDAnalytics.userSet(["level": "1"])
```

# Android
# 1\. SDK 통합

## 1.1 자동 통합 (Gradle)

1.  **Project 루트 디렉터리의 `build.gradle` 파일에 다음 의존성을 추가합니다.**

    ```groovy
    buildscript {
        repositories {
            jcenter()
            mavenCentral()
        }
    }
    ```

2.  **Module 디렉터리의 `build.gradle` 파일에 의존성을 추가합니다.**

    ```groovy
    dependencies {
        implementation 'cn.thinkingdata.android:ThinkingAnalyticsSDK:3.0.0-beta.1'
    }
    ```

## 1.2 수동 통합

1.  Android SDK를 [다운로드](https://www.google.com/search?q=https://github.com/ThinkingDataAnalytics/thinkingdata-android-sdk/releases)하고 압축을 해제합니다.
2.  프로젝트의 `libs` 폴더에 `TDAnalytics.aar` 및 `TDCore.aar` 파일을 추가합니다.
3.  Module의 `build.gradle` 파일에 다음 설정을 추가합니다.
    ```groovy
    dependencies {
        implementation fileTree(dir: 'libs', include: ['*.jar','*.aar'])
    }
    ```

-----

# 2\. SDK 초기화

#### (Java)

```java
// 메인 스레드에서 SDK 초기화
// 방식 1
TDAnalytics.init(this, APPID, SERVER_URL);

// 방식 2 (권장)
TDConfig config = TDConfig.getInstance(this, APPID, SERVER_URL);
TDAnalytics.init(config);
```

#### (Kotlin)

```kotlin
// 메인 스레드에서 SDK 초기화
// 방식 1
TDAnalytics.init(this, APPID, SERVER_URL)

// 방식 2 (권장)
val config = TDConfig.getInstance(this, APPID, SERVER_URL)
TDAnalytics.init(config)
```

**파라미터 설명:**

  * **`APPID`**: 프로젝트의 APPID로, TE 프로젝트 관리 페이지에서 확인할 수 있습니다.
  * **`SERVER_URL`**: 데이터 전송 URL
      * **SaaS(클라우드 서비스)**: 프로젝트 관리 → 프로젝트 설정 → 구성에서 데이터 전송 주소를 확인하세요.
      * **프라이빗(온프레미스) 배포**: 데이터 전송 주소를 직접 설정할 수 있습니다.

> **참고**: Android 9.0 이상에서는 기본적으로 HTTP 요청이 제한되므로, 데이터 전송 URL은 반드시 **HTTPS 프로토콜**을 사용해야 합니다.

-----

# 3\. 주요 기능

기본 기능 사용 전, **유저 식별 규칙**을 먼저 이해하는 것이 좋습니다. SDK는 기본적으로 랜덤값을 게스트 ID로 생성하여 사용하며, 유저가 로그인하기 전까지 이 ID가 식별자로 사용됩니다.

## 3.1 계정 ID 설정

유저가 로그인할 때 `login`을 호출하여 계정 ID를 설정합니다. TE 플랫폼은 이 ID를 식별자로 사용하며, `logout`을 호출하기 전까지 유지됩니다. `login`을 여러 번 호출하면 이전 ID는 덮어쓰입니다.

#### (Java)

```java
// 유저의 로그인 고유 식별자
// 이 값은 전송된 데이터의 #account_id에 매핑되며, 현재 #account_id 값은 "TA"입니다.
TDAnalytics.login("TA");
```

#### (Kotlin)

```kotlin
// 유저의 로그인 고유 식별자
// 이 값은 전송된 데이터의 #account_id에 매핑되며, 현재 #account_id 값은 "TA"입니다.
TDAnalytics.login("TA")
```

## 3.2 공통 이벤트 속성 설정

`setSuperProperties`를 호출하여 모든 이벤트에 포함될 공통 속성을 설정할 수 있습니다. 이벤트 전송 전에 미리 설정하는 것을 권장합니다.

#### (Java)

```java
try {
    JSONObject superProperties = new JSONObject();
    superProperties.put("channel", "ta"); // string
    superProperties.put("age", 1); // number
    superProperties.put("isSuccess", true); // boolean
    superProperties.put("birthday", new Date()); // date

    JSONObject object = new JSONObject();
    object.put("key", "value");
    superProperties.put("object", object); // object

    JSONObject object1 = new JSONObject();
    object1.put("key", "value");
    JSONArray arr = new JSONArray();
    arr.put(object1);
    superProperties.put("object_arr", arr); // object array

    JSONArray arr1 = new JSONArray();
    arr1.put("value");
    superProperties.put("arr", arr1); // array

    // 공통 이벤트 속성 설정
    TDAnalytics.setSuperProperties(superProperties);
} catch (JSONException e) {
    e.printStackTrace();
}
```

#### (Kotlin)

```kotlin
val superProperties = JSONObject().apply {
    put("channel", "ta") // string
    put("age", 1) // number
    put("isSuccess", true) // boolean
    put("birthday", Date()) // date
    put("object", JSONObject().apply { // object
        put("key", "value")
    })
    put("object_arr", JSONArray().apply { // object array
        put(JSONObject().apply {
            put("key", "value")
        })
    })
    put("arr", JSONArray().apply { // array
        put("value")
    })
}

// 공통 이벤트 속성 설정
TDAnalytics.setSuperProperties(superProperties)
```

**속성 규칙:**

  * 공통 속성은 캐시에 저장되므로 앱 실행 시마다 설정할 필요가 없으며, 재설정 시에는 이전 값을 덮어씁니다.
  * **Key (속성명):**
      * 문자열 타입이며 영문자로 시작해야 합니다.
      * 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
      * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다 (TE 시스템에서 자동으로 소문자로 변환).
  * **Value (속성값):**
      * `String`, `Number`, `Boolean`, `Date`, `JSONObject`, `JSONArray` 타입을 지원합니다.

## 3.3 자동 수집 활성화

앱 설치, 실행, 종료 등의 이벤트를 자동으로 수집할 수 있습니다.

#### (Java)

```java
// TDAnalytics.TDAutoTrackEventType.APP_INSTALL  → 앱 설치 이벤트
// TDAnalytics.TDAutoTrackEventType.APP_START  → 앱 실행 이벤트
// TDAnalytics.TDAutoTrackEventType.APP_END  → 앱 종료 이벤트

// 자동 수집 이벤트 활성화
TDAnalytics.enableAutoTrack(
    TDAnalytics.TDAutoTrackEventType.APP_START |
    TDAnalytics.TDAutoTrackEventType.APP_END |
    TDAnalytics.TDAutoTrackEventType.APP_INSTALL
);
```

#### (Kotlin)

```kotlin
// TDAnalytics.TDAutoTrackEventType.APP_INSTALL  → 앱 설치 이벤트
// TDAnalytics.TDAutoTrackEventType.APP_START  → 앱 실행 이벤트
// TDAnalytics.TDAutoTrackEventType.APP_END  → 앱 종료 이벤트

// 자동 수집 이벤트 활성화
TDAnalytics.enableAutoTrack(
    TDAnalytics.TDAutoTrackEventType.APP_START or
    TDAnalytics.TDAutoTrackEventType.APP_END or
    TDAnalytics.TDAutoTrackEventType.APP_INSTALL
)
```

## 3.4 이벤트 전송

`track` 메서드를 호출하여 이벤트를 전송합니다.

#### (Java)

```java
try {
    JSONObject properties = new JSONObject();
    properties.put("product_name", "상품 이름");
    TDAnalytics.track("product_buy", properties);
} catch (JSONException e) {
    e.printStackTrace();
}
```

#### (Kotlin)

```kotlin
val properties = JSONObject()
properties.put("product_name", "상품 이름")
TDAnalytics.track("product_buy", properties)
```

**이벤트 이름 규칙:**

  * 문자열 타입이어야 합니다.
  * 영문자로 시작해야 하며, 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
  * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다.

## 3.5 유저 속성 설정

`userSet` 메서드를 호출하여 유저 속성을 설정합니다.

  * 기존 속성 값이 있으면 **덮어쓰기(업데이트)** 됩니다.
  * 기존 속성이 없으면 **새로운 속성으로 추가**됩니다.

#### (Java)

```java
try {
    // 현재 username 값: "TA"
    JSONObject properties = new JSONObject();
    properties.put("username", "TA");
    TDAnalytics.userSet(properties);

    // username 값을 "TE"로 변경
    JSONObject newProperties = new JSONObject();
    newProperties.put("username", "TE");
    TDAnalytics.userSet(newProperties);
} catch (JSONException e) {
    e.printStackTrace();
}
```

#### (Kotlin)

```kotlin
// 현재 username 값: "TA"
val properties = JSONObject()
properties.put("username", "TA")
TDAnalytics.userSet(properties)

// username 값을 "TE"로 변경
val newProperties = JSONObject()
newProperties.put("username", "TE")
TDAnalytics.userSet(newProperties)
```

-----

# 4\. 코드 예시

다음은 설명된 모든 기능을 포함하는 예제 코드입니다.

#### (Java)

```java
if (유저가 개인정보 보호 정책에 동의함) {
    // 1. SDK 초기화
    TDAnalytics.init(this, APPID, SERVER_URL);

    // 2. 자동 수집 이벤트 활성화
    TDAnalytics.enableAutoTrack(
        TDAnalytics.TDAutoTrackEventType.APP_START | TDAnalytics.TDAutoTrackEventType.APP_END | TDAnalytics.TDAutoTrackEventType.APP_INSTALL
    );

    // 3. 유저가 로그인한 경우, 계정 ID 설정
    TDAnalytics.login("TA");

    // 4. 공통 이벤트 속성 설정 (모든 이벤트에 적용됨)
    try {
        JSONObject superProperties = new JSONObject();
        superProperties.put("channel", "ta");
        superProperties.put("age", 1);
        superProperties.put("isSuccess", true);
        superProperties.put("birthday", new Date());
        TDAnalytics.setSuperProperties(superProperties);
    } catch (JSONException e) {
        e.printStackTrace();
    }

    // 5. 이벤트 전송 (상품 구매)
    try {
        JSONObject properties = new JSONObject();
        properties.put("product_name", "상품 이름");
        TDAnalytics.track("product_buy", properties);
    } catch (JSONException e) {
        e.printStackTrace();
    }

    // 6. 유저 속성 설정 (예: 유저네임 설정)
    try {
        JSONObject userProperties = new JSONObject();
        userProperties.put("username", "TA");
        TDAnalytics.userSet(userProperties);
    } catch (JSONException e) {
        e.printStackTrace();
    }
}
```

#### (Kotlin)

```kotlin
if (유저가 개인정보 보호 정책에 동의함) {
    // 1. SDK 초기화
    TDAnalytics.init(this, APPID, SERVER_URL)

    // 2. 자동 수집 이벤트 활성화
    TDAnalytics.enableAutoTrack(
        TDAnalytics.TDAutoTrackEventType.APP_START or TDAnalytics.TDAutoTrackEventType.APP_END or TDAnalytics.TDAutoTrackEventType.APP_INSTALL
    )

    // 3. 유저가 로그인한 경우, 계정 ID 설정
    TDAnalytics.login("TA")

    // 4. 공통 이벤트 속성 설정 (모든 이벤트에 적용됨)
    val superProperties = JSONObject().apply {
        put("channel", "ta")
        put("age", 1)
        put("isSuccess", true)
        put("birthday", Date())
    }
    TDAnalytics.setSuperProperties(superProperties)

    // 5. 이벤트 전송 (상품 구매)
    val properties = JSONObject().apply {
        put("product_name", "상품 이름")
    }
    TDAnalytics.track("product_buy", properties)

    // 6. 유저 속성 설정 (예: 유저네임 설정)
    val userProperties = JSONObject().apply {
        put("username", "TA")
    }
    TDAnalytics.userSet(userProperties)
}
```

# Unity
# 1\. SDK 통합

## 1.1 수동 통합

1.  Unity SDK 리소스 파일을 [다운로드](https://www.google.com/search?q=https://github.com/ThinkingDataAnalytics/unity-sdk/releases)합니다.
2.  다운로드한 `ta_unity_sdk.unitypackage` 파일을 더블 클릭하거나, Unity 메뉴에서 **Assets \> Import Package \> Custom Package**를 선택하여 임포트합니다.

## 1.2 Package Manager 통합

v2.4.1부터 Package Manager를 통한 자동 통합을 지원합니다.

1.  Unity에서 **Window \> Package Manager** 메뉴를 엽니다.
2.  `+` 버튼을 클릭한 후, \*\*Add package from git URL...\*\*을 선택합니다.
3.  입력창에 `https://github.com/ThinkingDataAnalytics/unity-sdk.git` 를 입력한 후 **Add** 버튼을 클릭하고, 로딩이 완료될 때까지 기다립니다.

-----

# 2\. SDK 초기화

수동 초기화 방식을 권장하지만, 프리팹(Prefab)을 활용한 자동 초기화도 가능합니다.

## 2.1 수동 초기화

```csharp
using ThinkingData.Analytics;

// 초기화 방법 1
TDAnalytics.Init("APPID", "SERVER");

// 초기화 방법 2 (구성 객체 사용)
TDConfig config = new TDConfig("APPID", "SERVER");
TDAnalytics.Init(config);
```

## 2.2 자동 초기화

> **참고**
> Package Manager를 통해 SDK를 통합한 경우, 일부 설정이 제한될 수 있습니다. 실제 적용 가능 여부를 확인하세요.

1.  `Assets/ThinkingSDK/Prefab` 경로에 있는 `TDAnalytics` 프리팹(PreFab)을 씬(Scene)에 추가하고, 설정을 구성합니다.

\<img src="[https://thinkingdata.com/wp-content/uploads/2022/11/unity-en-config-1.png](https://www.google.com/search?q=https://thinkingdata.com/wp-content/uploads/2022/11/unity-en-config-1.png)" alt="TDAnalytics Prefab 설정" width="600"/\>

**설정 항목 설명:**

  * **Configuration**
      * **Start Manually (수동 초기화 여부)**
          * **활성화 (체크)**: `TDAnalytics.Init()`을 수동으로 호출하여 SDK를 초기화해야 합니다.
          * **비활성화 (체크 해제)**: `TDAnalytics` 프리팹이 로드될 때 자동으로 SDK가 초기화됩니다.
      * **Enable Log (로그 활성화 여부)**
          * 활성화하면 이벤트 업로드 상태 로그를 통해 디버깅할 수 있습니다.
  * **Configs**
      * 각 Config는 하나의 SDK 인스턴스를 나타냅니다. `+` 버튼으로 여러 인스턴스를 추가할 수 있습니다.
      * **APP ID**: 프로젝트의 APPID로, TE 프로젝트 관리 페이지에서 확인할 수 있습니다.
      * **SERVER URL**: 데이터 전송 URL
          * **SaaS(클라우드 서비스)**: 프로젝트 관리 → 프로젝트 설정 → 구성에서 데이터 전송 주소를 확인하세요.
          * **프라이빗(온프레미스) 배포**: 데이터 전송 주소를 직접 설정할 수 있습니다.
      * **MODE**: SDK 인스턴스 실행 모드. 실제 운영 환경에서는 반드시 **`NORMAL`** 모드를 사용해야 합니다.

> **주의**
> 일부 기기에서는 기본적으로 HTTP 통신이 차단될 수 있으므로, 반드시 **HTTPS** 형식의 서버 URL을 사용하는 것이 좋습니다.

-----

# 3\. 주요 기능

SDK 사용 전, **유저 식별 규칙**을 먼저 이해하는 것이 좋습니다.

  * SDK는 기본적으로 랜덤한 게스트 ID를 생성하여 로컬에 저장합니다.
  * 유저가 로그인하지 않은 경우, 게스트 ID가 기본 식별 ID로 사용됩니다.
  * 게스트 ID는 앱을 재설치하거나 기기를 변경하면 변경될 수 있습니다.

## 3.1 계정 ID 설정

유저가 로그인하면 `Login()` 메서드를 호출하여 계정 ID를 설정합니다.

  * 설정된 계정 ID는 `Logout()` 호출 전까지 유지됩니다.
  * `Login()`을 여러 번 호출하면 이전 계정 ID는 덮어쓰입니다.

<!-- end list -->

```csharp
// 유저의 로그인 ID 설정 (이 값은 전송되는 데이터의 #account_id 속성과 매칭됨)
TDAnalytics.Login("TA");
```

> **참고**: 이 메서드는 로그인 이벤트를 전송하지 않습니다.

## 3.2 공통 이벤트 속성 설정

`SetSuperProperties`를 호출하여 모든 이벤트에 포함될 공통 속성을 설정할 수 있습니다.

```csharp
Dictionary<string, object> superProperties = new Dictionary<string, object>();
superProperties["channel"] = "ta"; // string
superProperties["age"] = 1; // number
superProperties["isSuccess"] = true; // boolean
superProperties["birthday"] = DateTime.Now; // date
superProperties["object"] = new Dictionary<string, object>() { { "key", "value" } }; // object
superProperties["object_arr"] = new List<object>() { new Dictionary<string, object>() { { "key", "value" } } }; // object array
superProperties["arr"] = new List<object>() { "value" }; // array

TDAnalytics.SetSuperProperties(superProperties); // 공통 이벤트 속성 설정
```

  * **저장**: 공통 속성은 앱 캐시에 저장되므로 앱 실행 시마다 다시 설정할 필요가 없습니다.
  * **업데이트**: 동일한 키 값으로 다시 호출하면 기존 값을 덮어씁니다.
  * **Key (속성명):**
      * `string` 타입이며 영문자로 시작해야 합니다.
      * 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
      * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다 (TE 시스템에서 자동으로 소문자로 변환).
  * **Value (속성값):**
      * `string`, `number`, `bool`, `DateTime`, `Dictionary<string, object>`, `List<object>` 타입을 지원합니다.

## 3.3 자동 수집 활성화

앱 설치, 실행, 종료 등의 이벤트를 자동으로 수집할 수 있습니다.

```csharp
// 앱 설치, 실행, 종료 이벤트의 자동 수집 활성화
TDAnalytics.EnableAutoTrack(TDAutoTrackEventType.AppInstall | TDAutoTrackEventType.AppStart | TDAutoTrackEventType.AppEnd);
```

## 3.4 이벤트 전송

`Track()` 메서드를 호출하여 이벤트를 전송합니다.

```csharp
Dictionary<string, object> properties = new Dictionary<string, object>(){{"product_name", "상품 이름"}};
TDAnalytics.Track("product_buy", properties);
```

**이벤트 이름 규칙:**

  * `string` 타입이어야 합니다.
  * 영문자로 시작해야 하며, 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
  * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다.

## 3.5 유저 속성 설정

`UserSet()`을 사용하여 유저 속성을 설정합니다. 이 메서드는 기존 속성 값을 덮어씁니다.

  * 기존 속성이 없으면 새로운 속성으로 추가됩니다.

<!-- end list -->

```csharp
// 유저 이름을 "TA"로 설정
TDAnalytics.UserSet(new Dictionary<string, object>() { { "user_name", "TA" } });

// 유저 이름을 "TE"로 변경 (덮어쓰기)
TDAnalytics.UserSet(new Dictionary<string, object>() { { "user_name", "TE" } });
```

-----

# 4\. 코드 예시

다음은 설명된 모든 기능을 포함하는 예제 코드입니다.

```csharp
using ThinkingData.Analytics;
using System;
using System.Collections.Generic;

if (유저가_개인정보_보호_정책에_동의함)
{
    // 1. SDK 초기화
    TDAnalytics.Init("APPID", "SERVER");

    // 2. 모든 자동 수집 이벤트 활성화
    TDAnalytics.EnableAutoTrack(TDAutoTrackEventType.All);

    // 3. 유저가 로그인한 경우, 계정 ID 설정
    TDAnalytics.Login("TA");

    // 4. 공통 이벤트 속성 설정 (모든 이벤트에 자동 포함)
    Dictionary<string, object> superProperties = new Dictionary<string, object>
    {
        { "channel", "ta" },                  // String
        { "age", 1 },                         // Number
        { "isSuccess", true },                // Boolean
        { "birthday", DateTime.Now },         // DateTime
        { "object", new Dictionary<string, object>() { { "key", "value" } } }, // Object
        { "object_arr", new List<object>() { new Dictionary<string, object>() { { "key", "value" } } } }, // Object List
        { "arr", new List<object>() { "value" } } // Array
    };
    TDAnalytics.SetSuperProperties(superProperties);

    // 5. 이벤트 전송 (상품 구매)
    Dictionary<string, object> properties = new Dictionary<string, object>() { { "product_name", "상품 이름" } };
    TDAnalytics.Track("product_buy", properties);

    // 5.1 예시 - 이벤트 전송 (랭킹 정보 포함) - Object List 활용
    Dictionary<string, object> rank_info = new Dictionary<string, object>()
    {
        { "id", "123051" },
        { "rank", 1 },
        { "score", 85 }
    };
    List<object> rank_list = new List<object> { rank_info };
    Dictionary<string, object> eventProperties = new Dictionary<string, object>()
    {
        { "product_name", "아이템 이름" },
        { "rank_info", rank_list } // Object List
    };
    TDAnalytics.Track("product_buy_with_rank", eventProperties);

    // 6. 유저 속성 설정
    TDAnalytics.UserSet(new Dictionary<string, object>() { { "user_name", "TA" } });
}
```

# Unreal
# 1\. SDK 통합

## 1.1 TDAnalytics 플러그인 통합

Unreal SDK를 [다운로드](https://www.google.com/search?q=https://github.com/ThinkingDataAnalytics/unreal-sdk/releases)하여 압축 해제 후, `TDAnalytics` 디렉토리를 프로젝트의 `Plugins` 디렉토리에 복사합니다. (`Plugins` 디렉토리가 없다면 프로젝트 루트에 새로 생성합니다.)

## 1.2 TDAnalytics 플러그인 활성화 및 설정

1.  **플러그인 활성화**

      * Unreal Editor를 재시작합니다.
      * **Edit \> Plugins** 메뉴를 열어 **Analytics** 카테고리에서 **TDAnalytics**를 찾아 활성화(Enable)합니다.
      * (Blueprint 사용 시) **Analytics** 카테고리에서 **Analytics Blueprint Library**를 활성화합니다.
      * Unreal Editor를 다시 재시작합니다.

2.  **프로젝트 설정 구성**

      * **Edit \> Project Settings**로 이동하여 **TDAnalytics** 플러그인 설정을 구성합니다.
          * **Server Url**: (필수) 데이터 수신 주소. 반드시 HTTPS 형식을 사용해야 합니다.
          * **App ID**: (필수) TE 백엔드의 프로젝트 관리 페이지에서 발급받은 APP ID.
          * **TimeZone**: (선택) 표준 시간대 ID (예: `UTC+08:00`).
          * **Enable Encrypt**: (선택, 기본값 `false`) 활성화 시 데이터가 암호화되어 전송됩니다.
          * **EncryptPublicKey**: (암호화 사용 시 선택) 암호화 공개 키.
          * **EncryptVersion**: (암호화 사용 시 선택) 키 버전.
          * **SymmetricEncryption**: (암호화 사용 시 선택) 대칭 키.
          * **AsymmetricEncryption**: (암호화 사용 시 선택) 비대칭 키.

    > **주의**: Windows/MacOS 플랫폼은 시간대 동기화를 지원하지 않습니다.

3.  **엔진 설정 파일 수정**

      * 프로젝트의 `Config` 디렉터리에 있는 `DefaultEngine.ini` 파일에 다음 내용을 추가합니다.

    <!-- end list -->

    ```ini
    [Analytics]
    ProviderModuleName=TDAnalytics
    ```

4.  **C++ 프로젝트 설정**

      * C++ 코드에서 SDK를 직접 사용하는 경우, 프로젝트의 `*.Build.cs` 파일에 다음 의존성을 추가합니다.

    <!-- end list -->

    ```cpp
    PrivateDependencyModuleNames.AddRange(new string[] { "TDAnalytics" });
    PrivateIncludePathModuleNames.AddRange(new string[] { "TDAnalytics" });
    ```

      * SDK를 사용하는 파일 상단에 헤더 파일을 포함시킵니다.

    <!-- end list -->

    ```cpp
    #include "TDAnalytics.h"
    ```

-----

# 2\. SDK 초기화

다음 코드를 호출하여 SDK를 초기화합니다. 초기화가 완료되어야 이벤트 전송이 가능합니다.

```cpp
// SDK 초기화
UTDAnalytics::Initialize();
```

-----

# 3\. 주요 기능

기본 기능 사용 전, **유저 식별 규칙**을 먼저 이해하는 것이 좋습니다. SDK는 기본적으로 랜덤값을 게스트 ID로 생성하여 사용하며, 유저가 로그인하기 전까지 이 ID가 식별자로 사용됩니다.

## 3.1 계정 ID 설정

유저가 로그인할 때 `Login()`을 호출하여 계정 ID를 설정합니다. TE 플랫폼은 이 ID를 식별자로 사용하며, `Logout()` 호출 전까지 유지됩니다. `Login()`을 여러 번 호출하면 이전 ID는 덮어쓰입니다.

```cpp
// 유저의 고유 로그인 식별자. 데이터의 #account_id에 해당합니다.
UTDAnalytics::Login("TE");
```

> **참고**: 이 메서드는 로그인 이벤트를 전송하지 않습니다.

## 3.2 공통 이벤트 속성 설정

`SetSuperProperties()`를 호출하여 모든 이벤트에 포함될 공통 속성을 설정할 수 있습니다.

```cpp
TSharedPtr<FJsonObject> Properties = MakeShareable(new FJsonObject);
Properties->SetStringField("channel", "TE"); // string
Properties->SetNumberField("age", 1); // number
Properties->SetBoolField("isSuccess", true); // boolean

FDateTime DateTime = FDateTime::Now();
FString FormattedDateTime = FDateTime::FromUnixTimestamp(DateTime.ToUnixTimestamp()).ToString(TEXT("%Y-%m-%d %H:%M:%S."));
FormattedDateTime += FString::Printf(TEXT("%03d"), DateTime.GetMillisecond());
Properties->SetStringField("birthday", FormattedDateTime); // date

TSharedPtr<FJsonObject> ItemProperties = MakeShareable(new FJsonObject);
ItemProperties->SetStringField("itemChannel", "item");
Properties->SetObjectField("object", ItemProperties); // object

TArray<TSharedPtr<FJsonValue>> DataObjectArray;
TSharedPtr<FJsonObject> ArrayItemProperties = MakeShareable(new FJsonObject);
ArrayItemProperties->SetStringField("arrayItemChannel", "array_item");
DataObjectArray.Add(MakeShareable(new FJsonValueObject(ArrayItemProperties)));
Properties->SetArrayField("object_arr", DataObjectArray); // object array

TArray<TSharedPtr<FJsonValue>> DataArray;
DataArray.Add(MakeShareable(new FJsonValueString("data_value")));
Properties->SetArrayField("arr", DataArray); // array

UTDAnalytics::SetSuperProperties(Properties); // 공통 이벤트 속성 설정
```

**속성 규칙:**

  * **Key (속성명):**
      * `string` 타입이며 영문자로 시작해야 합니다.
      * 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
      * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다 (자동으로 소문자로 변환).
  * **Value (속성값):**
      * `String`, `Number`, `Boolean`, `Date`, `Object`, `Object Array`, `Array` 타입을 지원합니다.

## 3.3 자동 수집 활성화

앱 설치, 실행, 종료 등의 이벤트를 자동으로 수집할 수 있습니다.

```cpp
// 자동 수집 활성화
UTDAnalytics::EnableAutoTrack();
```

## 3.4 이벤트 전송

`Track()` 메서드를 호출하여 이벤트를 전송합니다.

```cpp
TSharedPtr<FJsonObject> Properties = MakeShareable(new FJsonObject);
Properties->SetStringField("product_name", "상품 이름"); // string

// 속성이 포함된 이벤트 전송
UTDAnalytics::Track("product_buy", Properties);
```

**이벤트 이름 규칙:**

  * `string` 타입이어야 합니다.
  * 영문자로 시작해야 하며, 숫자, 영문자, 밑줄(`_`)을 포함할 수 있습니다.
  * 최대 길이는 50자이며, 대소문자는 구분되지 않습니다.

## 3.5 유저 속성 설정

`UserSet()`을 사용하여 유저 속성을 설정합니다. 이 메서드는 기존 속성 값을 덮어씁니다.

  * 기존 속성이 없으면 새로운 속성으로 추가됩니다.

<!-- end list -->

```cpp
// 현재 유저 이름을 "TA"로 설정
TSharedPtr<FJsonObject> Properties = MakeShareable(new FJsonObject);
Properties->SetStringField("username", "TA");
UTDAnalytics::UserSet(Properties);

// 유저 이름을 "TE"로 변경 (덮어쓰기)
TSharedPtr<FJsonObject> NewProperties = MakeShareable(new FJsonObject);
NewProperties->SetStringField("username", "TE");
UTDAnalytics::UserSet(NewProperties);
```

-----

# 4\. 코드 예시

다음은 설명된 모든 기능을 포함하는 예제 코드입니다.

```cpp
#include "TDAnalytics.h"

if (유저가_개인정보_보호_정책에_동의함) {
    // 1. SDK 초기화
    UTDAnalytics::Initialize();

    // 2. 자동 수집 이벤트 활성화 (전체)
    UTDAnalytics::EnableAutoTrack();

    // 3. 유저가 로그인한 경우, 계정 ID를 고유 식별자로 설정
    UTDAnalytics::Login("TA");

    // 4. 공통 이벤트 속성 설정
    TSharedPtr<FJsonObject> SuperProperties = MakeShareable(new FJsonObject);
    SuperProperties->SetStringField("channel", "ta");
    SuperProperties->SetNumberField("age", 1);
    SuperProperties->SetBoolField("isSuccess", true);
    // ... (날짜, 객체 등 다른 속성 추가)
    UTDAnalytics::SetSuperProperties(SuperProperties);

    // 5. 이벤트 전송
    TSharedPtr<FJsonObject> EventProperties = MakeShareable(new FJsonObject);
    EventProperties->SetStringField("product_name", "상품 이름");
    UTDAnalytics::Track("product_buy", EventProperties);

    // 6. 유저 속성 설정
    TSharedPtr<FJsonObject> UserProperties = MakeShareable(new FJsonObject);
    UserProperties->SetStringField("username", "TA");
    UTDAnalytics::UserSet(UserProperties);
}
```

# Restful API
# Restful API 가이드

이 가이드는 데이터 접속 API를 사용하는 방법에 대해 안내합니다. 데이터 접속 API를 활용하면 SDK와 같은 전송 도구 없이 HTTP의 `POST` 메서드를 사용해 Thinking Engine(TE) 백엔드로 데이터를 직접 전송할 수 있습니다.

> **주의: API 연동 전 필독**
> 데이터 연동을 시작하기 전에, 먼저 **데이터 규칙**을 숙지해야 합니다. TE의 데이터 형식과 규칙을 이해한 후, 본 가이드를 참고하여 연동을 진행하세요. `POST` 메서드로 업로드하는 데이터는 반드시 TE 데이터 형식을 따라야 합니다.

## 1\. 데이터 형식 변환

데이터를 전송하기 전에, 먼저 데이터를 TE에서 요구하는 형식으로 변환해야 합니다. TE에서는 모든 데이터를 JSON 객체로 처리하며, 데이터 예시는 다음과 같습니다. (가독성을 위해 정렬하여 표시)

```json
{
  "#account_id": "ABCDEFG-123-abc",
  "#distinct_id": "F53A58ED-E5DA-4F18-B082-7E1228746E88",
  "#type": "track",
  "#ip": "192.168.171.111",
  "#time": "2017-12-18 14:37:28.527",
  "#event_name": "test",
  "properties": {
    "#lib": "LogBus",
    "#lib_version": "1.0.0",
    "#screen_height": 1920,
    "#screen_width": 1080,
    "argString": "abc",
    "argNum": 123,
    "argBool": true
  }
}
```

> **참고**: 데이터 형식에 대한 상세한 규칙은 **데이터 규칙** 섹션을 확인하세요.

## 2\. 데이터 전송

JSON 데이터가 준비되면, HTTP `POST` 요청을 통해 TE 서버로 데이터를 전송할 수 있습니다. 모든 인터페이스의 문자 인코딩은 `UTF-8`을 사용합니다.

### 2.1 데이터 수신 엔드포인트 (`form-data` 전송)

이 방식은 데이터를 `form-data` 형식으로 전송합니다.

**엔드포인트 URL:**

  * **SaaS 서비스:**
    ```
    https://te-receiver-naver.thinkingdata.kr/sync_data
    ```
  * **프라이빗(온프레미스) 서비스:**
    ```
    http://<데이터 전송 서버 주소>/sync_data
    ```

#### 요청 파라미터 (Request Body)

  * **단일 JSON 데이터 전송:**
      * `appid`: (필수) 프로젝트의 APP ID
      * `data`: (필수) JSON 데이터 (UTF-8 인코딩 후 **urlencode** 필요)
      * `client`: (선택) `0` 또는 `1` (기본값 `0`). `1`로 설정 시 요청 클라이언트의 IP를 데이터의 `#ip` 필드에 강제로 덮어씁니다.
  * **다중 JSON 데이터 전송:**
      * `appid`: (필수) 프로젝트의 APP ID
      * `data_list`: (필수) 여러 개의 JSON 데이터를 포함한 JSONArray (UTF-8 인코딩 후 **urlencode** 필요)
      * `client`: (선택) 위와 동일.

> **참고**: 일부 프로그래밍 언어의 라이브러리(예: Python3의 `requests`)나 Postman과 같은 도구는 `urlencode`를 자동으로 처리할 수 있어 별도 인코딩이 필요하지 않을 수 있습니다.

#### `curl`을 이용한 API 호출 예제

① **원본 데이터**

```json
{
  "#account_id": "testing",
  "#time": "2019-01-01 10:00:00.000",
  "#type": "track",
  "#event_name": "testing",
  "properties": { "test": "test" }
}
```

② **`urlencode` 적용 후 데이터**

```
%7b%22%23account_id%22%3a%22testing%22%2c%22%23time%22%3a%222019-01-01+10%3a00%3a00.000%22%2c%22%23type%22%3a%22track%22%2c%22%23event_name%22%3a%22testing%22%2c%22properties%22%3a%7b%22test%22%3a%22test%22%7d%7d
```

③ **`curl`을 이용한 데이터 전송**

```bash
curl "http://receiver:9080/sync_data" \
--data "appid=test-sdk-appid&data=%7b%22%23account_id%22%3a%22testing%22%2c%22%23time%22%3a%222019-01-01+10%3a00%3a00.000%22%2c%22%23type%22%3a%22track%22%2c%22%23event_name%22%3a%22testing%22%2c%22properties%22%3a%7b%22test%22%3a%22test%22%7d%7d"
```

#### 반환 파라미터

응답 값에서 `code: 0`이 반환되면 데이터 전송이 성공한 것입니다.

#### 디버그(Debug) 모드

요청 시 `debug=1` 파라미터를 추가하면, 데이터 검증 실패 시 상세한 오류 메시지를 받을 수 있습니다. 디버그 모드는 테스트 시에만 사용하고 운영 환경에서는 비활성화하는 것을 권장합니다.
**오류 응답 예시:**

```json
{
  "code": -1,
  "msg": "#time 필드의 형식이 올바르지 않습니다. [yyyy-MM-dd HH:mm:ss] 또는 [yyyy-MM-dd HH:mm:ss.SSS] 형식으로 전달해야 합니다."
}
```

-----

### 2.2 데이터 수집 API (`raw` 전송)

이 방식은 Request Body에 `raw` JSON 형식으로 데이터를 직접 전송합니다.

**엔드포인트 URL:**

  * **SaaS 서비스:**
    ```
    https://te-receiver-naver.thinkingdata.kr/sync_json
    ```
  * **프라이빗(온프레미스) 서비스:**
    ```
    http://<데이터 전송 서버 주소>/sync_json
    ```

#### 요청 파라미터 (Request Body)

  * **단일 JSON 데이터 전송 예시:**
    ```json
    {
      "appid": "debug-appid",
      "debug": 0,
      "data": {
        "#type": "track",
        "#event_name": "test",
        "#time": "2019-11-15 11:35:53.648",
        "properties": { "a": "123", "b": 2 },
        "#distinct_id": "1111"
      }
    }
    ```
  * **여러 개의 데이터 배열 전송 예시:**
    ```json
    [
        {
            "appid": "debug-appid",
            "data": {
              "#type": "track",
              "#event_name": "test",
              "#time": "2019-11-15 11:35:53.648",
              "properties": { "a": "123", "b": 2 },
              "#distinct_id": "1111"
            }
        },
        {
            "appid": "debug-appid",
            "data": {
              "#type": "track",
              "#event_name": "test",
              "#time": "2019-11-15 11:35:53.648",
              "properties": { "a": "123", "b": 2 },
              "#distinct_id": "1111"
            }
        }
    ]
    ```

#### 반환 파라미터

응답 값에서 `code: 0`이 반환되면 데이터 전송이 성공한 것입니다.

#### 디버그(Debug) 모드

JSON 데이터에 `debug: 1` 필드를 추가하면 상세한 오류 메시지를 받을 수 있습니다. (현재 디버그 모드는 단일 데이터 전송에만 지원)
**오류 응답 예시:**

```json
{
  "code": -1,
  "msg": "#time 필드의 형식이 올바르지 않습니다. [yyyy-MM-dd HH:mm:ss] 또는 [yyyy-MM-dd HH:mm:ss.SSS] 형식으로 전달해야 합니다."
}
```

#### 데이터 압축

Request Header에 `compress` 필드를 추가하여 압축된 데이터를 업로드할 수 있습니다.

  * **`compress: gzip`** 으로 설정하면 서버에서 gzip 방식으로 압축을 해제합니다.
  * **지원 압축 방식:** `gzip`, `lzo`, `lz4`, `snappy`
  * **기본값:** 압축 없음

#### 업로드 클라이언트의 IP 가져오기

Request Header에 `client: 1`을 추가하면 서버에서 요청 클라이언트의 IP를 데이터의 `#ip` 필드에 강제로 덮어씁니다. 기본값은 `0` (수집 안 함)입니다.
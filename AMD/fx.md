# Bulldozer(15h)와 Jaguar(16h)

| 지원 | 버전 |
| :--- | :--- |
| 지원되는 OpenCore 버전 | 0.6.3 |
| 최조 macOS 지원 | macOS 10.13 High Sierra |

## 시작

config.plist를 만드는 것이 어려워 보일 수도 있지만 사실은 그렇지 않습니다. 어느 정도의 시간이 필요하며, 관련된 내용은 모두 이 가이드에 자세히 설명되어 있습니다. 또한 문제가 있을 때, config.plist 설정이 맞는지 확인해주세요. OpenCore에 대해서 알아둘 점은 다음과 같습니다:

* **모든 속성이 정의되어야 합니다**: OpenCore에는 속성이 없을 경우 사용할 기본값이 없기 떄문에 **가이드에 속성을 삭제하라고 쓰여 있지 않는 한 속성을 지우지 말아주세요**. 이 가이드에 쓰여 있지 않은 속성은 기본값을 유지해주세요.
* **sample.plist 파일을 그대로 사용할 수 없습니다**: 해킨토시를 하려는 컴퓨터에 맞춰서 속성을 정의해야 합니다.
* **구성기(configurator)를 쓰지 마세요**: 구성기는 OpenCore의 설정을 무시하거나 심지어 Clover 부트로더의 설정을 추가하기도 해서 config.plist를 망칩니다(그럼 처음부터 다시 해야겠죠?).

이 가이드에서 사용할 툴은 다음과 같습니다:

* [ProperTree](https://github.com/corpnewt/ProperTree)
  * 범용 plist 편집기
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
  * SMBIOS 데이터 생성기
* [Sample/config.plist](https://github.com/acidanthera/OpenCorePkg/releases)
  * [config.plist 설정](../config.plist/README.md)을 참고해 파일을 얻는 방법을 알아보세요.
* [AMD 커널 패치](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore)
  * AMD 하드웨어에서 macOS를 부팅하는데 필요합니다. 아래에 이와 관한 설명이 있으니 미리 저장해주세요.
  * [Bulldozer/Jaguar(15h/16h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/15h_16h) (10.13 High Sierra, 10.14 Mojave, 10.15 Catalina 지원)

**그리고 OpenCore를 설정하기 전에 이 가이드를 여러 번 읽고 OpenCore를 맞게 설정했는지 확인하세요. 이미지가 항상 최신이 아닐 수 있기 때문에, 이미지 아래 텍스트를 읽고, 아무 언급이 없으면 기본값으로 유지해주세요.**

## ACPI

![ACPI](../images/config/AMD/acpi-fx.png)

### Add

::: tip 정보

이 섹션에서 시스템에 맞는 SSDT가 추가되며, 이는 **macOS를 부팅하고** [USB 매핑](https://dortania.github.io/OpenCore-Post-Install/usb/), [미지원 GPU 끄기](../extras/spoof.md) 등을 하는 데 필요합니다. 이 사스템에서, **이는 심지어 부팅하는데도 필수죠**. SSDT를 만드는 것에 관한 가이드는 [**ACPI 시작하기(영어)**](https://dortania.github.io/Getting-Started-With-ACPI/)를 참고하세요.

| 필요한 SSDT | 설명 |
| :--- | :--- |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | 임베디드 컨트롤러와 USB 전원을 픽스합니다. 더 자세한 내용은 [Getting Started With ACPI 가이드(영어)](https://dortania.github.io/Getting-Started-With-ACPI/)를 참고하세요. |

 여기에 자동 생성된 `DSDT.aml`을 추가하면 **안 됩니다**. 이는 이미 펌웨어에 있습니다. 만약 `DSDT.aml`이 존재한다면, EFI/OC/ACPI와 config.plist에서 `DSDT.aml`에 대한 엔트리를 제거하세요.

SSDT 제작 및 컴파일, DSDT 덤프 등에 대한 자세한 정보는 [**Getting started with ACPI(영어) 가이드**](https://dortania.github.io/Getting-Started-With-ACPI/)를 참고하세요. 컴파일된 SSDT의 확장자는 **.aml**이며, `EFI/OC/ACPI` 폴더에 위치하고 config.plist의 `ACPI -> Add`에도 설정되어있어야 합니다.

:::

### Delete

이 섹션은 특정 ACPI 테이블의 로딩을 차단하며, 지금은 무시할 수 있습니다.

### Patch

이 섹션은 OpenCore를 통해 ACPI의 부분(SSDT, DSDT 등)을 편집할 수 있도록 합니다. 이 가이드에서, 패치는 SSDT에 의해 핸들링됩니다. 이는 OpenCore에서 Windows나 다른 OS를 부팅할 수 있도록 해 주기 때문에 더 좋은 방법이죠.

### Quirks

ACPI에 대한 설정입니다. 여기서는 이 Quirk를 사용하지 않으므로 기본값을 유지해주세요.

## Booter

![Booter](../images/config/config-universal/aptio-iv-booter.png)

이 섹션은 OpenRuntime.efi(Clover에서 `AptioMemoryFix.efi`의 대체제)를 통한 boot.efi 패칭에 관한 Quirks와 관한 섹션입니다.

### MmioWhitelist

이 섹션은 일반적으로 무시되는 공간을 macOS로 보내기 위한 색션입니다. `DevirtualizeMnio`를 사용할 때 유용합니다.

### Quirks

::: tip 정보
boot.efi 패치와 펌웨어 픽스와 관련된 설정입니다. 이 가이드에서는 기본값을 유지해주세요.
:::
::: details 자세한 정보

* **AvoidRuntimeDefrag**: true
  * 날짜, 시간, NVRAM, 전원 관리 등의 UEFI 런타임 서비스를 픽스합니다.
* **EnableWriteUnprotector**: true
  * CR0 레지스터에서 쓰기 보호를 끄기 위해 필요합니다.
* **SetupVirtualMap**: true
  * SetVirtualAddresses가 가상 주소로 연락하는 것을 픽스합니다. Gigabyte 메인보드에서 커널 패닉을 해결하기 위해 필요합니다.
  
:::

## DeviceProperties

![DeviceProperties](../images/config/config-universal/DP-no-igpu.png)

### Add

맵에서 디바이스 속성을 설정합니다.

기본 설정에서 이 섹션은 내장 GPU와 사운드에 대해 설정되어 있습니다. AMD CPU에는 내장 GPU가 없기 때문에 PciRoot `PciRoot(0x0)/Pci(0x2,0x0)`을 `Add` 섹선에서 삭제해주세요. 사운드는 boot-args에서 레이아웃을 픽스하는 방식을 사용할 것이기 때문에 `Add`와 `Block` 섹션에서 `PciRoot(0x0)/Pci(0x1b,0x0)`도 삭제해주세요.

이 가이드에서는 이 섹션을 사용하지 않기 때문에 모든 PciRoot를 삭제해주세요.

### Delete

맵에서 디바이스 속성을 삭제합니다. 이 가이드에서는 무시하면 되죠.

## Kernel

| Kernel | 커널 패치 |
| :--- | :--- |
| ![Kernel](../images/config/AMD/kernel.png) | ![](../images/config/AMD/kernel-patch.png) |

### Add

이 섹션에서 로드할 kext, 로드 순서, 각각의 kext별 아키덱쳐를 정의합니다. 기본적으로 ProperTree에서 생성된 내용을 유지하는 것이 권장되지만, 32비트 CPU는 아래 내용을 참고해주세요.

::: details 자세한 정보

알아두어야 할 점은 아래와 같습니다:
* 로드 순서
  * 모든 플러그인은 각각의 의존성 모듈 **다음에** 로드되어야 한다는 점을 기억하세요.
  * 예를 들어 Lilu 등의 kext는 VirtualSMC, AppleALC, WhateverGreen 등의 kext보더 먼저 로드되어야 하죠.

[ProperTree](https://github.com/corpnewt/ProperTree)사용자라면 **Cmd/Ctrl + Shift + R**을 통해 모든 kext를 직접 타이핑하지 않고 순서에 맞게 추가할 수 있어요.

* **Arch**
  * 해당 kext의 지원 아키덱쳐입니다.
  * 현재 지원되는 값은 `Any`, `i386`(32비트, x86, IA-32), `x86_64`(64비트, x64, amd64)입니다.
* **BundlePath**
  * 해당 kext의 이름입니다.
  * 예: `Lilu.kext`
* **Enabled**
  * kext를 사용하거나 사용하지 않도록 결정할 수 있습니다.
* **ExecutablePath**
  * kext 안에 숨겨진 실제 실행 파일의 경로입니다. kext 파일을 우클릭하고 `패키지 내용 보기`를 클릭해서 kext 내부 파일을 볼 수 있습니다. 일반적으로는 `Contents/MacOS/Kext`이지만, 일부 kext는 `Plugin` 폴더 안에 있습니다. plist-only kext는 이 속성이 필요하지 않습니다.
  * 예: `Contents/MacOS/Lilu`
* **MinKernel**
  * kext를 인젝션할 최소 커널 버전입니다. 아래 표를 통해 입력할 수 있는 값을 확인해주세요.
  * ex. `12.00.00` for OS X 10.8
* **MaxKernel**
  * kext를 인젝션할 최대 커널 버전입니다. 아래 표를 통해 입력할 수 있는 값을 확인해주세요.
  * ex. `11.99.99` for OS X 10.7
* **PlistPath**
  * kext 안에 숨겨진 `info.plist` 파일의 경로입니다.
  * 예: `Contents/Info.plist`
  
::: details 커널 지원 표

| macOS 버전 | MinKernel | MaxKernel |
| :--- | :--- | :--- |
| 10.4(Tiger) | 8.0.0 | 8.99.99 |
| 10.5(Leopard) | 9.0.0 | 9.99.99 |
| 10.6(Snow Leopard) | 10.0.0 | 10.99.99 |
| 10.7(Lion) | 11.0.0 | 11.99.99 |
| 10.8(Mountain Lion) | 12.0.0 | 12.99.99 |
| 10.9(Mavericks) | 13.0.0 | 13.99.99 |
| 10.10(Yosemite) | 14.0.0 | 14.99.99 |
| 10.11(El Capitan) | 15.0.0 | 15.99.99 |
| 10.12(Sierra) | 16.0.0 | 16.99.99 |
| 10.13(High Sierra) | 17.0.0 | 17.99.99 |
| 10.14(Mojave) | 18.0.0 | 18.99.99 |
| 10.15(Catalina) | 19.0.0 | 19.99.99 |
| 11.0(Big Sur) | 20.0.0 | 20.99.99 |

:::

### Emulate

::: tip 정보

펜티엄이나 셀러론 등의 미지원 CPU를 스푸핑하거나 AMD CPU 등의 CPU 전원 관리 미지원 CPU에서 CPU 전원 관리를 끄기 위해 필요합니다.

| Quirk | true 여부 |
| :--- | :--- |
| DummyPowerManagement | 예 |

:::

::: details 자세한 정보

* **CpuidMask**: 빈칸으로 유지해주세요.
  * 가짜 CPUID 마스킹
* **CpuidData**: 빈칸으로 유지해주세요.
  * 가짜 CPUID 엔트리
* **DummyPowerManagement**: YES
  * NullCPUPowerManagement의 새로운 대체제입니다. 모든 AMD 기반 시스템에는 네이티브 전원 관리 시스템이 없개 때문에 필요합니다. 인텔 기반 시스템은 무시하면 되죠.
* **MinKernel**: 빈칸으로 유지해주세요.
  * 위의 패치가 인젝션될 최소 커널 버전입니다. 값이 없으면 모든 macOS 버전에 적용됩니다. 아래 표를 통해 입력할 수 있는 값을 확인해주세요.
  * 예: OS X 10.8(Mountain Lion)의 경우 `12.00.00`
* **MaxKernel**: 빈칸으로 유지해주세요.
  * 위의 패치가 인젝션될 최대 커널 버전입니다. 값이 없으면 모든 macOS 버전에 적용됩니다. 아래 표를 통해 입력할 수 있는 값을 확인해주세요.
  * 예: OS X 10.7(Lion)의 경우 `11.99.99`

::: details 커널 지원 표

| macOS 버전 | MinKernel | MaxKernel |
| :--- | :--- | :--- |
| 10.4(Tiger) | 8.0.0 | 8.99.99 |
| 10.5(Leopard) | 9.0.0 | 9.99.99 |
| 10.6(Snow Leopard) | 10.0.0 | 10.99.99 |
| 10.7(Lion) | 11.0.0 | 11.99.99 |
| 10.8(Mountain Lion) | 12.0.0 | 12.99.99 |
| 10.9(Mavericks) | 13.0.0 | 13.99.99 |
| 10.10(Yosemite) | 14.0.0 | 14.99.99 |
| 10.11(El Capitan) | 15.0.0 | 15.99.99 |
| 10.12(Sierra) | 16.0.0 | 16.99.99 |
| 10.13(High Sierra) | 17.0.0 | 17.99.99 |
| 10.14(Mojave) | 18.0.0 | 18.99.99 |
| 10.15(Catalina) | 19.0.0 | 19.99.99 |
| 11.0(Big Sur) | 20.0.0 | 20.99.99 |

:::

### Force

시스템 볼륨에서 kext를 로딩하는데 사용되며, 일부 kext가 캐시에 존재하지 않는 오래된 운영체제(예: OS X 10.16(Snow Leopard)에서의 IONetworkingFamily)에만 사용됩니다. 

이 가이드에서는 무시해도 됩니다.

### Block

특정 kext가 로드되지 않도록 합니다. 이 가이드에서는 무시해도 됩니다.

### Patch

여기에서 AMD 커널 패치가 진행됩니다. Clover에서의 `KernelToPatch`와 `MatchOS`가 OpenCore에서는 `Kernel`과 `MinKernel`/`maxKernel`입니다. [AlGrey](https://amd-osx.com/forum/memberlist.php?mode=viewprofile&u=10918&sid=e0feb8a14a97be482d2fd68dbc268f97)(algrey#9303)가 만든 패치를 아래에서 다운로드할 수 있습니다.

커널 패치:

* [Bulldozer/Jaguar(15h/16h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/15h_16h) (10.13 High Sierra, 10.14 Mojave, 10.15 Catalina)

병합 방법:

* 두 파일을 열어주세요.
* config.plist에서 `Kernel -> Patch` 섹션을 삭제해주세요.
* patches.plist에서 `Kernel -> Patch` 섹션을 복사해주세요.
* 복사한 내용을 config.plist의 `Kernel -> Patch`에 넣어주세요.

![](../images/config/AMD/kernel.gif)

### Quirks

::: tip 정보

커널과 관련된 설정입니다. 이 가이드에서는 아래 속성을 사용합니다:

| Quirk | true 여부 |
| :--- | :--- |
| PanicNoKextDump | 예 |
| PowerTimeoutKernelPanic | 예 |
| XhciPortLimit | 예 |

:::

::: details 자세한 정보

* **AppleCpuPmCfgLock**: false
  * CFG-Lock을 BIOS에서 끌 수 없을 때 필요합니다. AMD 사용자는 무시해도 됩니다.
* **AppleXcpmCfgLock**: false
  * CFG-Lock을 BIOS에서 끌 수 없을 때 필요합니다. AMD 사용자는 무시해도 됩니다.
* **AppleXcpmExtraMsrs**: false
  * 펜티엄이나 일부 제온 등의 미지원 CPU에 필요한 다중 MSR 엑세스를 끕니다. 
* **CustomSMBIOSGuid**: false
  * UpdateSMBIOS가 `Custom`으로 설정된 경우의 GUID 패치를 실행합니다. 일반적으로 Dell 노트북에 필요합니다.
  * 이 quirk를 `PlatformInfo -> UpdateSMBIOSMode -> Custom`과 함께 사용하는 것은 비 애플 OS로의 SMBIOS 인젝션을 끄지만, 이 방법은 Bootcamp 호환성을 없애버리기 때문에 권장하지 않습니다. 
* **DisableIoMapper**: false
  * AMD에는 DMAR이나 VT-d가 없기 때문에 관련이 없죠.
* **DisableLinkeditJettison**: true
  * `keepsyms=1` 없이 Lilu 등이 더욱 안정적인 성능을 갖도록 하기 위해 사용합니다.
* **DisableRtcChecksum**: false
  * AppleRTC가 주 체크섬(0x58~0x59)에 쓰는 것을 막기 위해 사용됩니다. 재부팅/종료 후에 BIOS가 초기화되거나 안전 모드가 됐을 떄 필요하죠.
* **ExtendBTFeatureFlags** false
  * 비 애플/비 Fenvi 카드 관련 연속성 문제가 있을 때 사용하면 좋습니다.
* **LapicKernelPanic**: false
  * AP 코어 lapic 인터럽트로 인한 커널 패닉을 끕니다. 일반적으로 HP 시스템에 필요하죠. Clover의 `kernel LAPIC`과 동일합니다.
* **LegacyCommpage**: false
  * macOS에서 64비트 CPU의 SSSE3 요구 사항을 해결합니다. 일반적으로 64비트 펜티엄 4 CPU에 필요합니다.
* **PanicNoKextDump**: true
  * 커널 패닉이 발생할 때 커널 패닉 로그를 읽을 수 있도록 합니다.
* **PowerTimeoutKernelPanic**: true
  * macOS Catalina에서의 Apple 드라이버 변경과 관련된 커널 패닉을 픽스하는 데 사용됩니다. 보통 디지털 오디오와 관련해서 많이 발생하죠.
* **XhciPortLimit**: true
  * 이는 15 포트 제한에 관란 패치입니다. 이는 검증된 해결책이 아니기 때문에 이 속성에 의존하지 말아주세요. AMD 기반 시스템에서의 더 인기 있는 방법은 [AMD USB 매핑](https://dortania.github.io/OpenCore-Post-Install/usb/)을 참고해주세요.
:::

### Scheme

레거시 부팅(10.4~10.6 등)에 관한 설정입니다. 일반적으로 무시하면 되지만 옛날 OS를 부팅하려면 아래를 참고하세요:

::: details 자세한 정보

* **FuzzyMatch**: true
  *  kernalcache에 관한 체크섬을 무시하면서 가능한 마지막 캐시를 사용하지 않도록 하기 위해서 사용됩니다. 
* **KernelArch**: x86_64
  * 커널의 아키덱쳐를 설정합니다. `Auto`, `i386`(32비트, x86, IA-32) 또는  `x86_64`(64비트, x64, amd64)를 사용할 수 있습니다. 
  * 32비트 커널(예: 10.4 및 10.5)이 필요한 옛날 OS를 부팅하는 경우 값을 `Auto`로 설정하고 SMBIOS를 기반으로 macOS가 선택하도록 설정해주세요. 가능한 값을 아래 표를 참고해주세요:
  * 
    * 10.4-10.5 — `x86_64`, `i386` 또는 `i386-user32`
      * `i386-user32`는 32비트 userspace를 의미하기 때문에 32비트 CPU이거나 SSSE3이 없는 경우 이 값을 사용해야 합니다.
      * `x86_64`도 32비트 userspace를 지원하지만 10.4/10.5에서 64비트 userspace를 보장하기 위해 사용합니다.
    * 10.6 — `i386`, `i386-user32` 또는 `x86_64`
    * 10.7 — `i386` 또는 `x86_64`
    * 10.8 이상 — `x86_64`

* **KernelCache**: `Auto`
  * 커널 캐시 타입을 설정합니다. 일반적으로 디버깅에 유용하며 가장 좋은 지원을 위해 `Auto`로 설정하는 것을 권장합니다.

:::

## Misc

![Misc](../images/config/config-universal/misc.png)

### Boot

부팅 스크린에 대한 설정입니다. (모든 값을 기본값으로 유지해주세요.)

### Debug

::: tip 정보

OpenCore의 부팅 문제를 디버깅하는 데 유용합니다. 이 가이드에서는 `DisplayDelay`를 *제외한* 모든 값을 변경합니다:

| Quirk | true 여부(또는 값) |
| :--- | :--- |
| AppleDebug | 예 |
| ApplePanic | 예 |
| DisableWatchDog | 예 |
| Target | 67 |

:::

::: details 자세한 정보

* **AppleDebug**: true
  * boot.efi 로깅을 사용합니다. 디버그하는 데 유용하죠. 참고로 10.15.4 이상에서만 지원돼요. 
* **ApplePanic**: true
  * 커널 패닉을 디스크에 로깅하는 것을 시도합니다.
* **DisableWatchDog**: true
  * UEFI watchdog를 끕니다. 부팅 문제 해결에 도움이 되죠.
* **DisplayLevel**: `2147483650`
  * 더 많은 디버그 정보를 보여줍니다. OpenCore는 DEBUG 버전이 필요해요.
* **SerialInit**: false
  * OpenCore의 Serial 출력을 설정하는 데 필요합니다.
* **SysReport**: false
  * ACPI 테이블 덤프 등의 디버깅에 유용합니다. 
  * 이는 OpenCore의 DEBUG 버전에만 적용돼요.
* **Target**: `67`
  * 더 많은 디버그 정보를 보여줍니다. 이는 OpenCore의 DEBUG 버전에만 적용돼요.

이 값은 [OpenCore 디버깅](../troubleshooting/debug.md)에서 계산된 값입니다.

:::

### Security

::: tip 정보

이 가이드에서는 아래 값을 변경합니다:

| Quirk | true 여부 또는 값 | 설명 |
| :--- | :--- | :--- |
| AllowNvramReset | 예 | |
| AllowSetDefault | 예 | |
| ScanPolicy | 0 | |
| SecureBootModel | Default |  이는 단어이며, 대소문자가 구분됩니다. Apple의 보안 부팅을 사용하지 않는 경우에는 값을 `Disabled`로 변경해주세요. |
| Vault | Optional | 이는 단어이며, 값을 비워도 되는 것이 아닙니다. (값을 비우면 부팅되지 않아요.) 또한 대소문자가 구분됩니다. |

:::

::: details 자세한 정보

* **AllowNvramReset**: true
  * 부트 엔트리와 Cmd+Option+P+R을 통해 NVRAM 초기화를 허용합니다.
* **AllowSetDefault**: true
  * 부트 메뉴에서 `Control+Enter`를 통한 기본 부트 엔트리 설정을 허용합니다. 
* **ApECID**: 0
  * 개인화된 보안 부팅 식별자를 네팅하는 데 사용됩니다. 현재 이 quirk는 macOS Installer의 버그로 인해 안정적이지 않으므로 기본값을 유지하는 걸 권장해요. 
* **AuthRestart**: false
  * FileVault 2의 인증된 재시동을 하용하며, 재시동 시 비밀번호가 필요하지 않습니다. 보안 결함이 될 수 있기 때문에 선택입니다.
* **BootProtect**: Bootstrap
  * BOOTx64.efi 대신 EFI/OC/Bootstrap에 있는 Bootstrap.efi를 사용합니다. rEFInd를 사용하거나 Windows 및 기타 OS에서의 BOOTx64.efi 덮어쓰기를 방지하기 위해 사용합니다. 이 quirk의 사용에 관한 내용은 [Bootstrap.efi 사용하기(영어)](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootstrap.html#preparation)를 참고하세요.
* **DmgLoading**: Signed
  * 서명된 DMG만 로드를 허용합니다.
* **ExposeSensitiveData**: `6`
  * 더 많은 디버그 정보를 보여줍니다. OpenCore의 DEBUG 버전이 필요하죠.
* **Vault**: `Optional`
  * 여기서는 Vault에 관해서 다루지 않을 것이기 때문에 무시합니다. **이 값을 Secure로 설정하면 부팅되지 않습니다.**
  * 이는 단어이며, 값을 비워도 되는 것이 아닙니다. (값을 비우면 부팅되지 않아요.) 또한 대소문자가 구분됩니다.
* **ScanPolicy**: `0`
  * `0`은 가능한 모든 디스크를 볼 수 있도록 허용합니다. 자세한 정보는 [보안 섹션(영어)](https://dortania.github.io/OpenCore-Post-Install/universal/security.html)를 참고하세요. **기본값으로 설정되면 USB 디바이스를 부팅할 수 없어요.**
* **SecureBootModel**: Default
  * macOS에서의 Apple 보안 부팅 기능을 사용합니다. 자세한 정보는 [보안 섹션(영어)](https://dortania.github.io/OpenCore-Post-Install/universal/security.html)를 참고하세요.
  * 참고: OpenCore가 이미 설치된 시스템에서 OpenCore를 업데이트하려고 할 때 부팅이 실패할 수 있습니다. 이를 해결하려면, [OCB: LoadImage failed - Security Violation에서 멈춤(영어)](/troubleshooting/extended/kernel-issues.md#stuck-on-ocb-loadimage-failed-security-violation)를 참고하세요.

:::

### Tools

셸 등의 OpenCore 디버깅 도구를 실행하는 데 사용됩니다. ProperTree의 스냅샷 기능이 이 값을 자동으로 추가합니다.

### Entries

OpenCore를 통해 자연스럽게 발견될 수 없는 부트 경로를 지정하는 데 사용합니다.

이 가이드에서는 다루지 않아요. 자세한 정보는 [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)의 8.6 섹션을 참고해주세요.

## NVRAM

![NVRAM](../images/config/config-universal/nvram.png)

### Add

::: tip 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14

OpenCore의 UI 스케일링에 사용됩니다. 기본값으로도 잘 돼죠.

:::

::: details 자세한 정보

Booter 경로입니다. UI 스케일링에 주로 사용됩니다.

* **UIScale**:
  * `01`: 일반 해상도
  * `02`: HiDPI (일반적으로 작은 디스플레이에서 FileVault가 잘 동작하도록 하기 위해 필요해요.)

* **DefaultBackgroundColor**: boot.efi가 사용하는 배경색
  * `00000000`: Syrah Black
  * `BFBFBF00`: Light Gray

:::

::: tip 4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102

OpenCore의 NVRAM GUID입니다. 일반적으로 RTCMemoryFixup과 관련되어 있어요.

:::

::: details 자세한 정보

* **rtc-blacklist**: <>
  * RTCMemoryFixup과 함께 사용됩니다. 자세한 정보는 [RTC 쓰기 문제 해결하기(영어)](https://dortania.github.io/OpenCore-Post-Install/misc/rtc.html#finding-our-bad-rtc-region)를 참고해주세요.
  * 대부분의 사용자는 이 섹션을 무시해도 돼요.

:::

::: tip 7C436110-AB2A-4BBB-A880-FE41995C9F82

시스템 무결성 보호(SIP) 비트마스크

* **일반 boot-args**:

| boot-args | 설명 |
| :--- | :--- |
| **-v** | 이는 상세 로그 모드를 켭니다. 애플 로고와 로딩바 대신 ~~엄청난 것 같아 보이는~~ 부팅 프로세스와 관련된 텍스트가 뜨죠. 문제 해결에 큰 도움을 주기 때문에 매우 유용해요. |
| **debug=0x100** | 이는 macOS의 watchdog를 꺼서 커널 패닉 시 재부팅을 방지합니다. 이를 통해 커널 패닉이 일어났을 때 더 쉽게 문제를 해결할 수 있죠. |
| **keepsyms=1** | 이는 debug=0x100과 같이 쓰이는 설정으로, 커널 패닉 시 기호를 출력하도록 합니다. 이는 커널 패닉의 원인을 알아내는 데 유용하죠. |
| **npci=0x2000** | 이는 `kIOPCIConfiguratorPFM64`와 관련된 일부 PCI 디버딩을 끕니다. 대체제는 `gIOPCITunnelledKey`에 대한 디버깅을 추가로 끄는 `npci= 0x3000`입니다. `PCI Start Configuration`에서 막혔을 때 필요하죠(PCI 레인과 관련된 IRQ 충돌이 있는 경우에요). **Above4GDecoding이 켜져있을 때는 필요하지 않아요**. [소스 코드](https://opensource.apple.com/source/IOPCIFamily/IOPCIFamily-370.0.2/IOPCIBridge.cpp.auto.html) |

* **GPU 관련 boot-args**:

| boot-args | 설명 |
| :--- | :--- |
| **agdpmod=pikera** | Navi GPU(RX 5000 시리즈)에서 boardID를 끄는 데 사용하며, 이 속성 없이는 블랙 스크린이 발생합니다.**Navi가 없으면 사용하지 마세요.**(에: Polaris와 Vega 카드는 이 속성을 쓰면 안 돼요.) |
| **nvda_drv_vrl=1** | macOS Sierra와 High Sierra에서 Maxwell과 Pascal 카드에 대한 Nvidia 웹 드라이버를 켜기 위해 필요합니다. |

* **csr-active-config**: `00000000`
  * 시스템 무결성 보호(SIP)에 관한 설정입니다. 일반적으로 복구 파티션에서 `csrutil`를 이용해 이를 바꾸는 것을 권장합니다.
  * csr-active-config는 기본적으로 시스템 무결성 보호를 켜는 설정인 `00000000`으로 설정되어 있어요. 값을 다른 숫자로 바꿀 수 있지만, 되도록 보안을 위해 값을 유지하는 것을 권장합니다. 자세한 정보는 문재 해결 페이지의 [SIP 끄기(영어)](../troubleshooting/extended/post-issues.md#disabling-sip)를 이용해주세요.

* **run-efi-updater**: `No`
  * 이는 Apple의 펌웨어 업데이트 패키지의 설치로 인한 부팅 순서 꼬임을 방지하기 위해 사용됩니다. 이러한(리얼맥의) 펌웨어는 해킨토시에서 작동하지 않으므로 이 값이 중요하죠.

* **prev-lang:kbd**: <>
  * 비 라틴어 키보드에 사용되며, `언어:키보드`의 형식입니다. 별도로 지정할 수 있기 때문에 비워 두는 걸 권장합니다(**샘플 구성 파일의 기본값은 러시아어에요**).
  * 미국: `en-US:0`
  * 한국: `ko:0`(키보드를 한글 레이아웃으로 설정하면 영어 입력이 되지 않기 때문에 키보드 레이아웃을 영어로 설정하는 걸 권장합니다)
  * 전체 목록은 [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)에서 확인할 수 있어요.

| 키 | 타입 | 값 |
| :--- | :--- | :--- |
| prev-lang:kbd | String(문자열) | en-US:0 또는 ko:0 |

:::

### Delete

::: tip 정보

강제로 NVRAM 값을 재작성합니다. Add는 이미 존재하는 값을 덮어쓰지 않기 때문에 Delete를 사용해야 하죠. 이 가이드에서는 아래 항목을 변경합니다:

| Quirk | true 여부 |
| :--- | :--- |
| WriteFlash | 예 |

:::

::: details 자세한 정보

* **LegacyEnable**: false
  * NVRAM을 nvram.plist에 저장합니다. 내이티브 NVRAM이 없는 시스템에 필요해요.

* **LegacyOverwrite**: false
  * 펌웨어 변수를 nvram.plist에 덮어쓰는 것을 허용합니다. 내이티브 NVRAM이 없는 시스템에 필요해요.

* **LegacySchema**
  * NVRAM 값을 설정하는 데 사용합니다. `LegacyEnable`이 true로 설정된 경우 사용해요.

* **WriteFlash**: true
  * 모든 변수를 플래시 메모리에 씁니다.

:::

## PlatformInfo

![PlatformInfo](../images/config/config-universal/iMacPro-smbios.png)

::: tip 정보

여기에서 SMBIOS 데이터를 지정합니다. 이 가이드에서는 CorpNewt의 [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)를 사용합니다.

예시에서는 iMacPro1,1 SMBIOS를 사용하지만 GPU에 따라 다른 값을 이용해야 할 수도 있어요.

* iMacPro1,1: AMD RX Polaris와 Vega
* MacPro7,1: AMD RX Polaris, Vega, Navi(MacPro7,1은 macOS Catalina에서만 쓸 수 있어요)
* MacPro6,1: AMD R5/R7/R9와 그 이전 GPU
* iMac14,2: Nvidia Kepler와 최신 GPU

GenSMBIOS를 실행하고, 옵션 1을 선택해서 MacSerial을 다운로드하고 옵션 3을 선택서 SMBIOS를 생성하면 아래와 같은 내용이 출력됩니다:

```bash
  #######################################################
 #              iMacPro1,1 SMBIOS Info                 #
#######################################################

Type:         iMacPro1,1
Serial:       C02YX0TZHX87
Board Serial: C029269024NJG36CB
SmUUID:       DEA17B2D-2F9F-4955-B266-A74C47678AD3
```

값의 순서는 `Product | Serial | Board Serial (MLB)`입니다.

`Type` 값을 `Generic -> SystemProductName`에 복사해주세요.

`Serial` 값을 `Generic -> SystemSerialNumber`에 복사해주세요.

`Board Serial` 값을 `Generic -> MLB`에 복사해주세요.

`SmUUID` 값을 `Generic -> SystemUUID`에 복사해주세요.

We set Generic -> ROM to either an Apple ROM (dumped from a real Mac), your NIC MAC address, or any random MAC address (could be just 6 random bytes, for this guide we'll use `11223300 0000`. After install follow the [Fixing iServices](https://dortania.github.io/OpenCore-Post-Install/universal/iservices.html) page on how to find your real MAC Address)
그리고 `Generic -> ROM`에 Apple ROM(리얼맥에서 덤프됨), 실제 NIC의 MAC 주소, 혹은 그냥 6개의 랜덤 바이트(이 가이드에서는 `11223300 0000`을 사용합니다)를 입력해주세요. 설치 후에 실제 MAC 주소를 찾는 방법은 [iServices 픽스(영어)](https://dortania.github.io/OpenCore-Post-Install/universal/iservices.html)를 참고해주세요.

**여기서는 무효한 시리얼이나 사용 중이지 않은 유효한 시리얼이 필요하기 때문에, 아래 페이지에서 `Invalid Serial`이나 `Purchase Date not Validated` 등의 메세지가 떠야 합니다.**

[Apple Check Coverage page](https://checkcoverage.apple.com)

**Automatic**: true

* DataHub, NVRAM, SMMBIOS 섹션 대신 Generic 섹션을 기반으로 PlatformInfo를 생성합니다.

:::

### Generic

::: details 자세한 정보

* **AdviseWindows**: false
  * EFI 파티션이 Windows 디스크의 첫 번째 파티션이 아닐 때 사용합니다.

* **SystemMemoryStatus**: `Auto`
  * 메모리가 SMBIOS 정보에 저장되는 지 결정합니다. 코스메틱이기 때문에 `Auto`가 권장됩니다.
  
* **ProcessorType**: `0`
  * 자동 타입 감지를 사용하기 위해 `0`을 사용하지만, 원한다면 값을 바꿀 수 있습니다. 가능한 값에 대해서는 [AppleSmBios.h](https://github.com/acidanthera/OpenCorePkg/blob/master/Include/Apple/IndustryStandard/AppleSmBios.h)를 참고해주세요.

* **SpoofVendor**: true
  * vendor 필드를 Acidanthera로 변경합니다. 대부분의 경우는 Apple을 vendor로 사용하는 것이 안전하지 않아요.

* **UpdateDataHub**: true
  * Data Hub 필드를 업데이트합니다.

* **UpdateNVRAM**: true
  * NVRAM 필드를 업데이트합니다.

* **UpdateSMBIOS**: true
  * SMBIOS 필드를 업데이트합니다.

* **UpdateSMBIOSMode**: Create
  * 테이블을 새로 할당된 EfiReservedMemoryType으로 변경합니다. `CustomSMBIOSGuid` quirk가 필요한 Dell 노트북에서는 `Custom`을 사용하세요.
  * `CustomSMBIOSGuid` quirk를 켠 상태로 값을 `Custom`으로 할당해서 비 애플 운영체제에 SMBIOS 인젝션을 끌 수 있지만, 이는 Bootcamp 호환성을 없애기 때문에 이 방법을 권장하지 않습니다.

:::

## UEFI

![UEFI](../images/config/config-universal/aptio-v-uefi.png)

**ConnectDrivers**: true

* .efi 드라이버를 강제하며, false로 설정하면 자동으로 추가된 UEFI 드라이버를 연결하지 않습니다. 이는 부팅 속도를 높일 수 있지만, 일부 파일시스템 드라이버와 같은 몇몇 드라이버가 자동으로 연결되지 않을 수 있습니다.

### Drivers

.efi 드라이버를 추가합니다.

여기에 존재해야 하는 드라이버는 다음과 같습니다:

* HfsPlus.efi
* OpenRuntime.efi
* 기타 PS/2 드라이버, 레거시 시스템 드라이버 등

### APFS

APFS 드라이버와 관련된 설정입니다. 기본값을 유지해주세요.

### Audio

AudioDxe 설정과 관련된 섹션입니다. macOS의 사운드 지원과는 관련이 없으므로 기본값을 유지해주세요.

* AudioDxe와 Audio 섹션에 대한 자세한 사용 방법은 [설치 후 안정화: GUI와 부팅음 넣기(영어)](https://dortania.github.io/OpenCore-Post-Install/)를 참고해주세요.

### Input

FileVault와 핫키 지원에 사용되는 boot.efi 키보드 passthrough에 사용됩니다. 여기서는 이 quirk를 사용하지 않기 때문에 기본값을 유지해주세요. 자세한 정보는 [보안과 FileVault(영어)](https://dortania.github.io/OpenCore-Post-Install)을 참고해주세요.

### Output

OpenCore의 출력에 관한 설정입니다. 여기서는 이 quirk를 사용하지 않기 때문에 기본값을 유지해주세요.

### ProtocolOverrides

가상 머신, 레거시 맥, 그리고 FileVault에 관한 설정입니다. 저세한 정보는 [보안과 FileVault(영어)](https://dortania.github.io/OpenCore-Post-Install/)를 참고해주세요.

### Quirks

::: tip 정보
UEFI 환경에 관한 설정입니다. 이 가이드에서는 아래 설정을 변경합니다:

| Quirk | true 여부 | 설명 |
| :--- | :--- | :--- |
| UnblockFsConnect | 아니요 | 일반적으로 HP 메인보드를 이용하는 시스템에 필요해요. |

:::

::: details 자세한 정보

* **DeduplicateBootOrder**: true
  * 일부 부팅 접두사 변수의 폴백 값을 `OX_VENDOR_VARIABLE_GUID`에서 `EFI_GLOBAL_VARIABLE_GUID`로 변경합니다. 부트 옵션을 픽스하는 데 사용돼요.

* **RequestBootVarRouting**: true
  * AptioMemoryFix를 `EFI_GLOBAL_VARIABLE_GUID`에서 `OC_VENDOR_VARIABLE_GUID`로 리디렉션합니다. 펌웨어가 부팅 엔트리를 삭제하도록 하기 위해 사용되고, 업데이트 설치/시동 디스크 설정 등을 위해 모든 시스템에서 켜는 걸 권장해요.

* **UnblockFsConnect**: false
  * 일부 펌웨어는 파티션 핸들을 By Driver 모드로 열어서 차단하며, 이는 파일 시스템 프로토콜을 설치할 수 없게 합니다. 일반적으로 HP 시스템에서 표시된 드라이브가 없을 때 사용합니다.

:::

### ReservedMemory

특정 메모리 지역을 OS가 사용하지 않도록 하기 위해 사용하며, 일반적으로 인텔 2세대 샌디브릿지 CPU의 내장 GPU 혹은 결함이 있는 메모리를 사용하는 시스템에 사용됩니다. 이 가이드에서는 이 quirk의 사용에 관한 내용을 다루지 않습니다.

## 정리하기

이제 config.plist를 저장하고 EFI 파티션의 EFI/OC 폴더에 위치하면 됩니다.

부칭 이슈가 있다면 [문제 해결 섹션](../troubleshooting/troubleshooting.md)을 먼저 읽고 그래도 문제가 해결되지 않으면 아래와 같은 많은 정보를 참고해주세요:

* [AMD OS X Discord(영어)](https://discord.gg/QuUWg7)
* [r/Hackintosh Subreddit(영어)](https://www.reddit.com/r/hackintosh/)

**Sanity check**:

Ramus의 노력 덕에 config.plist를 맞게 설정했는지 확인할 수 있는 툴이 있습니다:

* [**Sanity Checker**](https://opencore.slowgeek.com)

이 툴을 Dortania와 관련이 없으며, 이 사이트에 대한 이슈는 [Sanity Checker 레포지토리](https://github.com/rlerdorf/OCSanity)를 이용해주세요.

# AMD BIOS 설정

* 이 옵션의 대부분이 펌웨어에 있지 않을 수도 있습니다. 이럴 때는 아래 설정과 최대한 비슷한 설정을 이용하는 것을 권장하지만, 이러한 옵션이 BIOS에 아예 없을 수도 있아요.

### 아래 옵션을 꺼 주세요

* Fast Boot
* Secure Boot
* Serial/COM Port
* Parallel Port
* Compatibility Support Module (CSM)(**꼭 꺼야 합니다. `gI0`과 같은 GPU 오류는 이 옵션이 켜져있을 때 자주 일어납니다.**)

### 아래 옵션을 켜 주세요

* Above 4G decoding(**꼭 켜야 합니다. 이 설정이 없을 경우 boot-args에 `npci-0x2000`을 추가하세요. 단, npci와 이 옵션을 같이 사용하지 말아주세요.**)
* EHCI/XHCI Hand-off
* SATA Mode: AHCI

# 모두 완료되었다면, [설치 페이지](../installation/installation-process.md)로 이동해주세요

# 커널 및 kext 패치 전환

## 직접 패치 전환하기

커널/kext 패치를 OpenCore에 맞게 전환할 때, 몇 가지를 기억해야 합니다:

* `InfoPlistPatch`와 같은 속성이 없습니다.
* `MatchOS`를 `MinKernel`과 `MaxKernel`로 바꿔주세요.
* 커널과 kext 패치 모두 `Kernel -> Patch`에 위치하고, `Identifier`를 통해 커널이나 특정 kext를 패치하려는 것인지 입력해주세요.

예시를 보면,

**KernelToPatch**:

| 키 | 타입 | 값 |
| :--- | :--- | :--- |
| Comment | String | cpuid_set_cpufamily - force CPUFAMILY_INTEL_PENRYN |
| Disabled | Boolean | False |
| MatchBuild | String | 18G95,18G103 |
| MatchOS | String | 10.14.6 |
| Find | Data | 31db803d4869980006755c |
| Replace | Data | bbbc4fea78e95d00000090 |

이 패치를 전환하려면, 아래를 확인해주세요:

* `Comment`: Clover와 OpenCore 모두 가능해요.
* `Disabled`: OpenCore는 대신 `Enabled`를 사용해요.
* `MatchBuild`: OpenCore는 `MinKernel`과 `MaxKernel`을 사용해요. 자세한 정보는 아래를 확인해주세요.
* `MatchOS`: OpenCore는 `MinKernel`과 `MaxKernel`을 사용해요. 자세한 정보는 아래를 확인해주세요.
* `Find`: Clover와 OpenCore 모두 가능해요.
* `Replace`: Clover와 OpenCore 모두 가능해요.
* `MaskFind`: OpenCore는 대신 `Mask`를 사용해요.
* `MaskReplace`: Clover와 OpenCore 모두 가능해요.

그러니까 위에 있는 패치는

**Kernel -> Patch**:

| 키 | 타입 | 값 |
| :--- | :--- | :--- |
| Comment | String | cpuid_set_cpufamily - force CPUFAMILY_INTEL_PENRYN |
| Enabled | Boolean | True |
| MinKernel | String | 18.7.0 |
| MaxKernel | String | 18.7.0 |
| Find | Data | 31db803d4869980006755c |
| Replace | Data | bbbc4fea78e95d00000090 |
| Identifier | String | kernel |
| Limit | Number | 0 |
| Count | Number | 0 |
| Skip | Number | 0 |
| Mask | Data | |
| ReplaceMask | Data | |

이렇게 되죠.

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

Identifier의 경우 `kernel` 혹은 패치할 kext(에: `com.apple.iokit.IOGraphicsFamily`)를 입력합니다.

Limit, Count, Skip은 모든 인스턴스에 적용하기 위해 `0`으로 설정합니다. Clover는 마스킹을 지원하지 않기 때문에 `Mask`와 `ReplaceMask` 는 빈칸으로 남겨두면 됩니다. 

## OpenCore에서의 일반 패치

OpenCore나 다른 kext로 병합된 일반 커널/kext 패치에 대해 언급하는 섹션입니다. 이 리스트는 완성되지 않았기 때문에 언급되지 않은 내용이 있으면 원본 레포에 [새 이슈를 만들어주세요](https://github.com/dortania/bugrtacker/issues).

### 커널 패치

OpenCore가 지원하는 패치에 대한 전체 리스트는 [/Library/OcAppleKernelLib/CommonPatches.c](https://github.com/acidanthera/OpenCorePkg/blob/master/Library/OcAppleKernelLib/CommonPatches.c)를 참고해주세요.

**일반 패치**:

* `MSR 0xE2 _xcpm_idle instant reboot` (c) Pike R. Alpha
  * `Kernel -> Quirks -> AppleXcpmCfgLock`

**HEDT 전용 패치**:

아래의 모든 패치는 `Kernel -> Quirk -> AppleXcpmExtraMsrs`로 병합되었습니다.

* `_xcpm_bootstrap` © Pike R. Alpha
* `xcpm_pkg_scope_msrs` © Pike R. Alpha
* `_xcpm_SMT_scope_msrs` 1 © Pike R. Alpha
* `_xcpm_SMT_scope_msrs` #2 (c) Pike R. Alpha
* `_xcpm_core_scope_msrs` © Pike R. Alpha
* `_xcpm_ performance_patch` © Pike R. Alpha
* xcpm MSR Patch 1 and 2 @Pike R. Alpha
* `/0x82D390/MSR_PP0_POLICY 0x63a xcpm support` patch 1 and 2 Pike R. Alpha

### Kext 패치

* `Disable Panic Kext logging`
  * `Kernel -> Quirks -> PanicNoKextDump`
* AppleAHCIPort 외부 아이콘 패치1
  * `Kernel -> Quirks -> ExternalDiskIcons`
* SSD Trim 켜기
  * `Kernel -> Quirks -> ThirdPartyDrives`
* USB 포트 제한 패치
  * `Kernel -> Quirks -> XhciPortLimit`
* FredWst DP/HDMI 패치
  * [AppleALC](https://github.com/acidanthera/AppleALC/releases) + [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
* IOPCIFamily 패치
  * `Kernel -> Quirks -> IncreasePciBarSize`
* board-ID 채크 끄기
  * [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
* AppleHDA 패치
  * [AppleALC](https://github.com/acidanthera/AppleALC/releases)
* IONVMe 패치
  * High Sierra 이상에서는 필요하지 않습니다.
  * Mojave 이상에서의 전원 관리는 [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)를 이용해주세요.

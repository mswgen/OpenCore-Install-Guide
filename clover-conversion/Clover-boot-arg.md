# Clover Boot Arg 전환

* 지원되는 버전: 0.6.3

이 섹션은 주로 더 이상 사용되지 않는 boot-arg에 대해 설명합니다. 최신 버전의 macOS에서 효과가 없거나 OpenCore에서 거의 효과가 없는 기존 args를 사용하는 건 꽤 흔한 일이죠

이 가이드는 기억과 이러한 플래그가 계속 나오는 것에 혼란스러워진 사람에 기반했습니다.~~번역이 좀 이상해졌네요;;;~~ 추가해야 할 다른 플래그를 찾았으면 [원본 레포에 이슈를 여는 것](https://github.com/dortania/bugtracker/issues)을 권장합니다.

## macOS 플래그

**dart=0**:

* VT-D를 끄는 데 사용됩니다.
* Clover에서 이 플래그가 존재한다면 동시에 ACPI에서 DMAR 테이블을 삭제합니다.
* 이 플래그는 macOS 10.15 Catalina에서 SIP이 꺼져 있어야 하며, OpenCore에서 이 플래그는 더 이상 권장되지 않고 `Kernel -> Quirks -> DisableIOMapper`로 이동했습니다.

**kext-dev-mode=1**:

* 서명되지 않은 kext를 로드하기 위해 사용되었으며, OS X 10.10 Yosemite에서만 사용되었습니다.
* 최신 릴리즈에서는 `csr-active-config` NVRAM 변수에 `CSR_ALLOW_UNSIGNED_KEXTS` 비트를 넣습니다.
* 사용된 커널 인젝션 방법(prelinked ketnel에 추가) 때문에 OpenCore에서는 필요하지 않습니다.

## Kexts 플래그

**nvda_drv=1**: Nvidia 웹 드라이버를 쓰기 위해 사용되었으며, macOS 10.12 Sierra에서는 사용되지 않습니다.

* 이 플래그는 Sierra와 High Sierra에서는 `nvda_drv_vrl=1`로 변경되었습니다.

## Chameleon 플래그

몇가지 이유로 사람들이 아직도(심지어 Clover에서도!) 효과가 없는 플래그를 쓰고 있는 걸 보고, 빨리 이걸 멈춰야겠단 생각이 들었죠.~~또 번역이;;;~~

**PCIRootUID=Value**

* 이는 `Devide (PCI0)`의 `_UID`를 입력한 값으로 설정합니다. 레거시 AMD GPU에서 필요하지만 이것마저도 논란이 있죠. 아이러니하게도 Clover는 아직도 이 플래그를 쓰지만 대부분의 유저들은 이것이 Chameleon 부트로더의 속성으로 알고 있어요. [소스 코드](https://github.com/CloverHackyColor/CloverBootloader/blob/81f2b91b1552a4387abaa2c48a210c63d5b6233c/rEFIt_UEFI/Platform/FixBiosDsdt.cpp#L1630-L1674)

**GraphicsEnabler=Yes/No**

* InjectAMD/Nvidia는 Clover에서 대신 사용했지만 OpenCore에서 [WhateverGreen](https://github.com/acidanthera/WhateverGreen)을 이용할 경우 같은 기능이 없습니다.

**IGPEnabler=Yes/No**

* GraphicsEnabler와 같은 기능이며, Clover에서는 InjectIntel을 사용했기 때문에 [WhateverGreen의 프레이버퍼 패치](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)와 같은 기능입니다.

**-f**

* Chameleon과 Clover에서 캐시리스 부팅을 켭니다. OpenCore는 `Kerner -> Scheme -> KernelCache`를 `Cacheless`로 변경하는 방법을 사용합니다.
  * 현재 캐시리스 부팅은 OS X 10.6~10.9의 64비트 커널에서만 지원됩니다.

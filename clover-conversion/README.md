# Clover에서 OpenCore로 전환하기

* 지원되는 버전: 0.6.3

새로운 OpenCore 부트로더를 시도해 보려고 했다면, 잘 왔어요! Clover에서의 많은 기능이 OpenCore에도 있지만, 그렇지 않은 것도 있습니다. Clover에서 가져올 수 있는 것과 그렇지 않은 것에 대해 여기서 다룹니다.

먼저, 아래 문서를 참고해주세요:

* [Config.plist 전환](../clover-conversion/Clover-config.md)
* [Kext와 펌웨어 드라이버 전환(.kext, .efi)](../clover-conversion/clover-efi.md)
* [부팅 인수 정환](../clover-conversion/Clover-boot-arg.md)
* [일반 커널/kext 패치 전환](../clover-conversion/clover-patch.md)

## macOS에서 Clover의 정크 파일 정리하기

먼저, 가상화된 NVRAM을 사용 중이라면 Clover와 관련해서 짜중난 게 많을 것입니다. Clover가 보통 삭제해야 할 골칫거리인 정크 파일을 남기기 때문이죠. 이를 정리하려면 SIP이 꺼져 있어야 해요.

확인해야 할 파일

* `/Volumes/EFI/EFI/CLOVER/drivers64UEFI/EmuVariableUefi-64.efi`
* `/Volumes/EFI/nvram.plist`
* `/etc/rc.clover.lib`
* `/etc/rc.boot.d/10.save_and_rotate_boot_log.local`
* `/etc/rc.boot.d/20.mount_ESP.local`
* `/etc/rc.boot.d/70.disable_sleep_proxy_client.local.disabled`
* `/etc/rc.shutdown.d/80.save_nvram_plist.local​`

만약 폴더가 비어있다면 아래 파일도 삭제해주세요:

* `/etc/rc.boot.d`
* `/etc/rc.shutdown.d​`

Clover의 설정 패널 사용자라면 아래 파일도 지워야 해요:

* `/Library/PreferencePanes/Clover.prefPane`
* `/Library/Application\ Support/clover`

## macOS에서 kext 삭제하기(S/L/E와 L/E)

Clover의 흔한 전통은 kext를 macOS와 함께, 특히 System/Library/Extensions(S/L/E)와 Library/Extensions(L/E)에 설치하는 것이었습니다. 그런데 Clover의 kext 인젝션은 macOS 업데이트마다, 혹은 그냥 갑자기 안 되기도 했다네요;;; OpenCore에서는 다행히도 훨씬 강력하고 안정적인 kext 인젝션 메커니즘을 쓰기 때문에 에러가 잘 나지 않습니다. 즉 봄 청소를 쫌 해야겠네요;;;(???)

**참고**: OpenCore는 이미 kernelcache에 있는 kext의 인젝션에 실패합니다. 그러므로 kernelcache를 삭제하는 것 또한 이러한 문제를 해결합니다.

이제 터미널을 열고 아래 내용을 순서대로 입력하세요:

```bash
sudo kextcache -i /
```

이 명령어는 S/L/E나 L/E에 있으면 안 되는 kext에 대해 출력합니다.

**모든 해킨토시 kext 삭제**:

```bash
sudo -s
touch /Library/Extensions /System/Library/Extensions​
kextcache -i /​
```

* **참고**, macOS Catalina 이상에서는 시스템 드라이브를 R/W 권한으로 마운트하기 위해 `mount -uw /` 명령어가 필요합니다.

## 하드웨어에서 Clover 정크 삭제

Clover가 숨겼을 지도 모르는 또 다른 건 NVRAM 변수입니다. 이는 OpenCore가 `NVRAM -> Block`에 있는 `Block` 기능을 통해 명시하지 않은 경우 변수를 덮어쓰지 않기 때문에 좋지 않습니다.

config.plist에서:

* `Misc -> Security -> AllowNvramReset -> True`

그리고 OpenCore로 처음 부팅한 다음, `Reset NVRAM` 부트 옵션을 선택하세요. 이는 모든 NVRAM 값을 삭제한 다음 재부팅합니다.

## 선택: 다른 운영체제로의 SMBIOS 인젝션 방지

기본적으로 OpenCore는 SMBIOS 데이터를 모든 운영체제에 인젝션합니다. 이유는 다음과 같이 2가지입니다:

* 이는 [BootCamp](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp.html) 등을 통한 좋은 멀티 부팅을 지원합니다.
* Clover에서 종종 보이는 것처럼 정보가 여러 번 인젝션되는 것을 방지합니다.

하지만, OpenCore에는 어디에서 macOS가 SMBIOS 정보를 읽는지를 패치해서 macOS로만 SMBIOS 인젝션을 허용하는 quirk가 있습니다. 이 quirk는 나중에 없어질 수 있기 때문에 특정 프로그램이 다른 운영체제를 망가뜨리지 않는 한 권장하지 않습니다. 

macOS 전용 SMBIOS 인젝션을 켜는 방법:

* Kernel -> Quirks -> CustomSMBIOSGuid -> True
* Platforminfo -> CustomSMBIOSMode -> Custom

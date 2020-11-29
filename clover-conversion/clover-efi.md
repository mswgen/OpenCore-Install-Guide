# Clover Kext와 펌웨어 드라이버 전환(.kext, .efi)

* 지원되는 버전: 0.6.3

알아두어야 할 점은 모든 kext와 펌웨어 드라이버를 config.plist에 입력해야 하며, 그렇지 않을 경우 로드되지 않습니다. 현재 Clover에서 지원되는 모든 kext는 OpenCore에서도 지원되지만, 대부분 권장되지 않습니다. 펌웨어 드라이버는 조금 다릅니다. 실제로 Clover 드라이버는 OpenCore가 부팅되지 않도록 하기도 하죠. 

* [kext](#kext)
* [펌웨어 드라이버](#펌웨어-드라이버)

## kext

대부분의 경우 모든 kext가 OpenCore에서 지원되지만, 일부는 통합되었습니다.

**통합된 Kext:**

* NullCPUPowerManagement.kext
  * `Kernel -> Emulate`의 `DummyPowerManagement`로 통합되었습니다.
* BT4LEContinuityFixup.kext
  * `Kernel -> Quirks`의 `ExtendBTFeatureFlags`로 통합되었습니다.

## 펌웨어 드라이버

**지원되는 드라이버:**

* AudioDxe.efi(Goldfish64 또는 Clover가 **아닌** [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg)에서 받은 파일로 바꿔주세요)
* CsmVideoDxe.efi([BiosVideo.efi](https://github.com/acidanthera/DuetPkg)가 더 권장됩니다)
* EnhancedFatDxe.efi
* ExFatDxeLegacy.efi
* ExFatDxe.efi
* GrubEXFAT.efi
* GrubISO9660.efi
* GrubNTFS.efi
* GrubUDF.efi
* HiiDatabase.efi
* HfsPlus.efi
* HfsPlusLegacy.efi
* NTFS.efi
* NvmExpressDxe.efi
* OpenRuntime.efi
* OpenUsbKbDxe.efi
* OsxFatBinaryDrv.efi
* Ps2MouseDxe.efi
* TbtForcePower.efi
* UsbMouseDxe.efi
* VBoxExt2.efi
* VBoxExt4.efi
* VBoxHfs.efi
* VBoxIso9600.efi
* XhciDxe.efi

**OpenCore에서 제공되거나 병합되어 필요하지 않은 드라이버**

* APFS.efi
* ApfsDriverLoader.efi
* AppleEvent.efi
* AppleGenericInput.efi
* AppleImageCodec.efi
* AppleKeyMapAggregator.efi
* AppleUiSupport.efi
* AppleUITheme.efi
* AptioInputFix.efi
* AptioMemoryFix.efi
* AudioDxe.efi([OpenCorePkg](https://github.com/acidanthera/OpenCorePkg)에서 받은 파일을 이용해주세요)
* BootChimeDxe.efi
* DataHubDxe.efi
* EmuVariableUEFI.efi
* EnglishDxe.efi
* FirmwareVolume.efi
* HashServiceFix.efi
* SMCHelper.efi
* OcQuirks.efi
* VirtualSMC.efi

**지원되지 않는 드라이버:**

* AppleUsbKbDxe.efi(OpenUsbKbDxe.efi로 변경됨)
* FSInject.efi
* FwRuntimeServices.efi(OpenRuntime.efi로 변경됨)
* osxaptiofix2drv-free2000.efi
* osxaptiofix2drv.efi
* osxaptiofix3drv.efi
* osxaptiofixdrv.efi
* OsxFatBinaryDrv.efi
* OsxLowMemFixDrv.efi
* UsbKbDxe.efi(OpenUsbKbDxe.efi로 변경됨)

### AptioMemoryFix 관련

Well before we actually get started on converting the Clover config, we must first talk about converting from AptioMemoryFix. The main thing to note is that it's inside of OpenCore with OpenRuntime being an extension, this means that AptioMemoryFix and that there's also a lot more settings to choose from. Please see the hardware specific sections of the OpenCore guide to know what Booter settings your system may require(HEDT like X99 and X299 should look to the closest CPU like Skylake-X should refer to Skylake guide and **read the comments** as they mention specifics for your system).
클로버 구성에서 전환하기 전에 먼저 AptioMemoryFix를 전환화는 것에 대한 내용이 필요합니다. 중요한 점은 OpenCore 내부에 OpenRuntime이 확장으로써 있다는 점입니다. 이는 AptioMemoryFix와 선택할 수 있는 설정도 훨씬 더 많다는 것을 의미하죠. 시스템에 어떤 Booter 설정이 필요한지 확인하려면 OpenCore 가이드의 하드웨어 관련 섹션을 참조하시기 바랍니다. 시스템에 어떤 Booter 설정이 필요한지 OpenCore 가이드의 하드웨어 관련 섹션을 참조해주세요(X99 및 X299와 같은 HEDT는 Skylake-X가 Skylake 가이드를 참고해야 하는 것처럼 가장 비슷한 CPU를 참고해야 하며 시스템에 대한 세부 사항을 언급하기도 하기 때문에 **설명을 읽어주세요**).
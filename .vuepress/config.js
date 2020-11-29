const {
    description
} = require('../package')

module.exports = {
    title: 'OpenCore 설치 가이드',
    head: [
        ['meta', {
            name: 'theme-color',
            content: '#3eaf7c'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
        }],
        ["link", {
            rel: "'stylesheet",
            href: "/styles/website.css"
        },]
    ],
    base: '/',
	
	watch: {
	    $page(newPage, oldPage) {
	      if (newPage.key !== oldPage.key) {
	        requestAnimationFrame(() => {
	          if (this.$route.hash) {
	            const element = document.getElementById(this.$route.hash.slice(1));

	            if (element && element.scrollIntoView) {
	              element.scrollIntoView();
	            }
	          }
	        });
	      }
	    }
	  },
	
	markdown: {
		extendMarkdown: md => {
			md.use(require('markdown-it-multimd-table'), {
				rowspan: true,
			});
		}
	},
	
    theme: 'vuepress-theme-succinct',
    globalUIComponents: [
        'ThemeManager'
    ],

    themeConfig: {
        lastUpdated: true,
        repo: 'https://github.com/mswgen/OpenCore-Install-Guide.git',
		editLinks: true,
		editLinkText: '이 사이트의 발전을 도와주세요!',
        logo: 'homepage.png',
        nav: [{
            text: 'Dortania 가이드',
            ariaLabel: '언어',
            items: [{
                text: 'Dortania 홈페이지(영어)',
                link: 'https://dortania.github.io/'
            },
            {
                text: 'ACPI 시작하기(영어)',
                link: 'https://dortania.github.io/Getting-Started-With-ACPI/'
            },
            {
                text: 'OpenCore 설치 후 안정화(영어)',
                link: 'https://dortania.github.io/OpenCore-Post-Install/'
            },
            {
                text: 'GPU 구매 가이드(영어)',
                link: 'https://dortania.github.io/GPU-Buyers-Guide/'
            },
            {
                text: '무선 랜카드 구매 가이드(영어)',
                link: 'https://dortania.github.io/Wireless-Buyers-Guide/'
            },
            {
                text: '해킨토시 컴퓨터 구매 가이드(영어)',
                link: 'https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/'
            },
            ]
        },
        ],
        sidebar: [{
            title: '소개',
            collapsable: false,
            sidebarDepth: 1,
            children: [
				'prerequisites',
				{
                    title: '하드웨어 제한',
                    collapsable: true,
                    path: 'macos-limits',
                    children: [
                        'find-hardware'
                    ]
                },
                'terminology',
                'why-oc',
            ]

        },
        {
            title: 'USB 만들기',
            collapsable: false,
            sidebarDepth: 2,
            children: [{
                title: 'USB 만들기',
                collapsable: true,
                path: '/installer-guide/',
                sidebarDepth: 1,
                children: [
                    '/installer-guide/mac-install',
                    '/installer-guide/winblows-install',
                    '/installer-guide/linux-install',
                ],
            },
                '/installer-guide/opencore-efi',
                'ktext',
            ['https://dortania.github.io/Getting-Started-With-ACPI/', 'ACPI 시작하기(영어)'],
                '/config.plist/',
            ]
        },
        {
            title: '설정',
            collapsable: false,
            children: [{
                title: '인텔 데스크톱 config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    ['/config.plist/penryn', '코어 2 펜린'],
                    ['/config.plist/clarkdale', '1세대 클락데일'],
                    ['/config.plist/sandy-bridge', '2세대 샌드브릿지'],
                    ['/config.plist/ivy-bridge', '3세대 아이비브릿지'],
                    ['/config.plist/haswell', '4세대 하스웰, 5세대 브로드웰'],
                    ['/config.plist/skylake', '6세대 스카이레이크'],
                    ['/config.plist/kaby-lake', '7세대 카비레이크'],
                    ['/config.plist/coffee-lake', '8, 9세대 커피레이크'],
                    ['/config.plist/comet-lake', '10세대 코멧레이크'],
                ]
            },
            {
                title: '인텔 노트북 config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    ['/config-laptop.plist/arrandale', '1세대 아란데일'],
                    ['/config-laptop.plist/sandy-bridge', '2세대 샌디브릿지'],
                    ['/config-laptop.plist/ivy-bridge', '3세대 아이비브릿지'],
                    ['/config-laptop.plist/haswell', '4세대 하스웰'],
					['/config-laptop.plist/broadwell', '5세대 브로드웰'],
                    ['/config-laptop.plist/skylake', '6세대 스카이레이크'],
                    ['/config-laptop.plist/kaby-lake', '7세대 카비레이크'],
                    ['/config-laptop.plist/coffee-lake', '8, 9세대 커피레이크, 위스키레이크'],
					['/config-laptop.plist/coffee-lake-plus', '10세대 코멧레이크'],
                    ['/config-laptop.plist/icelake', '11세대 아이스레이크'],
                ]
            },
            {
                title: '인텔  HEDT config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    '/config-HEDT/nehalem',
                    '/config-HEDT/ivy-bridge-e',
                    '/config-HEDT/haswell-e',
                    '/config-HEDT/broadwell-e',
                    '/config-HEDT/skylake-x',
                ]
            },
            {
                title: 'AMD 데스크톱 config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    '/AMD/fx',
                    '/AMD/zen',
                ]
            },
            ]
        },
        {
            title: '설치',
            collapsable: false,
            children: [
                '/installation/installation-process',

            ]
        },
        {
            title: '문제 해결',
            collapsable: false,
            children: [
                '/troubleshooting/troubleshooting',
				{
            		title: '',
            		collapsable: false,
		            children: [
		                '/troubleshooting/extended/opencore-issues',
						'/troubleshooting/extended/kernel-issues',
						'/troubleshooting/extended/userspace-issues',
						'/troubleshooting/extended/post-issues',
						'/troubleshooting/extended/misc-issues',

		            ]
				},
                '/troubleshooting/debug',
                '/troubleshooting/boot',
            ]
        },
        {
            title: '설치 후 안정화(영어)',
            collapsable: false,
            children: [
                ['https://dortania.github.io/OpenCore-Post-Install/', '설치 후 안정화'],
                {
                    title: 'Universal',
                    collapsable: true,
                    sidebarDepth: 1,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/security', '보안과 FileVault'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/audio', '사운드 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/oc2hdd', 'USB 없이 부팅하기'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/update', 'OpenCore, kext 및 macOS 업데이트'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/drm', 'DRM 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/iservices', 'iService 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/pm', '전원 관리 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/sleep', '잠자기(절전 모드) 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/usb/', 'USB 픽스'],
                    ]
                },
                {
                    title: '노트북 전용',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/laptop-specific/battery', '배터리 픽스'],

                    ]
                },
                {
                    title: '코스메틱',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/cosmetic/verbose', '해상도 및 로그 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/cosmetic/gui', 'GUI와 부팅음 추가'],
                    ]
                },
                {
                    title: '멀티 부팅',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/multiboot/bootstrap', 'Bootstrap.efi 사용하기'],
                        ['https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp', 'BootCamp 설치'],
                    ]
                },
                {
                    title: '기타',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/rtc', 'RTC 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/msr-lock', 'CFG Lock 픽스'],
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/nvram', 'NVRAM 에뮬레이션'],
                    ]
                },
            ]
        },
        {
            title: '그 외',
            collapsable: false,
			sidebarDepth: 2,
            children: [
                '/extras/kaslr-fix',
                '/extras/spoof',
                '/extras/big-sur/',
                {
                    title: 'Clover에서 OpenCore로 이동하기',
                    collapsable: true,
                    children: [
                        ['/clover-conversion', '시작하기'],
                        ['/clover-conversion/Clover-boot-arg', 'boot-arg 변경'],
                        ['/clover-conversion/Clover-config', 'config.plist 변경'],
                        ['/clover-conversion/clover-efi', 'efi 변경'],
                        ['/clover-conversion/clover-patch', '커널 패치 관련']
                    ]
                },
                '/extras/smbios-support.md',
            ]
        },
        {
            title: '기타',
            collapsable: false,
            children: [
                'CONTRIBUTING',
                '/misc/credit',
            ]
        },
        ],
    },
    plugins: [
        '@vuepress/plugin-back-to-top',
        'vuepress-plugin-smooth-scroll',
        ['vuepress-plugin-medium-zoom',
            {
                selector: "img",
                options: {
                    background: 'var(--bodyBgColor)'
                }
            }],
    ]
}

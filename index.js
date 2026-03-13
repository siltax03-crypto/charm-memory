/**
 * CHARM Memory — Loader
 * 서버에서 최신 코드를 받아서 실행합니다.
 */

import { saveSettingsDebounced, saveChatDebounced, eventSource, event_types, getRequestHeaders } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';

const SERVER_URL = 'https://charm-memory.vercel.app';

async function loadExtension() {
    try {
        const res = await fetch(`${SERVER_URL}/api/extension`);
        const data = await res.json();

        if (!data.ok) {
            toastr.error(data.message || '서비스가 종료되었습니다.', 'CHARM Memory', { timeOut: 10000 });
            return;
        }

        // CSS 삽입
        const style = document.createElement('style');
        style.id = 'charm-memory-styles';
        style.textContent = data.css;
        document.head.appendChild(style);

        // 코드 실행
        eval(data.code);

        window.__charmMemoryInit({
            saveSettingsDebounced,
            saveChatDebounced,
            eventSource,
            event_types,
            getRequestHeaders,
            extension_settings,
            SlashCommandParser,
            SlashCommand,
        });

    } catch (err) {
        console.error('[CHARM] 로드 실패:', err);
        toastr.error('서버 연결 실패', 'CHARM Memory');
    }
}

loadExtension();

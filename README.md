# Calculadora CFDI - Neto ⇄ Subtotal (IVA + Retenciones)

Una calculadora web para profesionales que necesitan calcular el desglose de facturas CFDI con IVA, ISR retenido y retención de IVA.

## 🚀 Características

- **Cálculo bidireccional**: De neto a subtotal y viceversa
- **Métodos de cálculo**:
  - Fórmula algebraica directa
  - Goal Seek (respeta redondeos de facturadores)
  - Cálculo desde subtotal conocido
- **Tasas configurables**: IVA, ISR retenido, fracción de retención IVA
- **Opciones de precisión**: Alta precisión interna y redondeo por línea
- **Exportación**: JSON y CSV
- **Responsive**: Funciona en móviles y desktop

## 🛠 Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Variables CSS)
- JavaScript ES6+
- Sin dependencias externas

## 📊 Tasas por defecto

- **IVA**: 16%
- **ISR retenido**: 10%
- **Retención IVA**: 2/3 (10.666...%)

## 🚀 Despliegue

### Netlify (Recomendado)

1. **Conectar repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Configuración automática:
     - Build command: (dejar vacío)
     - Publish directory: `.`

2. **Despliegue automático**:
   - Cada push a `main` se despliega automáticamente
   - URL personalizada disponible

### Despliegue local

```bash
# Instalar live-server
npm install -g live-server

# Ejecutar servidor de desarrollo
live-server --port=3000 --open=/index.html
```

## 📝 Uso

1. **Desde Neto**: Introduce el monto que recibiste y calcula el subtotal
2. **Desde Subtotal**: Introduce un subtotal y calcula el desglose completo
3. **Goal Seek**: Encuentra el subtotal exacto que produce el neto deseado

## 🔧 Configuración

- Ajusta las tasas según tus necesidades
- Activa/desactiva redondeo por línea
- Configura precisión interna

## 📄 Licencia

MIT License - ver [LICENSE.md](LICENSE.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado por** [Ramses Martinez](https://github.com/ramthedev)

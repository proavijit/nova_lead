'use client'

import { useEffect, useState } from "react"

const leads = [
  { name: "James Dawson", role: "CTO", company: "Vercel", score: 99, color: "#06b6d4" },
  { name: "Laura Park", role: "VP Eng", company: "Notion", score: 97, color: "#6366f1" },
  { name: "Sam Rivera", role: "CTO", company: "Linear", score: 95, color: "#10b981" },
  { name: "Aiko Kimura", role: "Head Eng", company: "Loom", score: 92, color: "#f472b6" },
]

export default function HeroIllustration() {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (

    <div style={{
      width: "100%",
      maxWidth: "620px",
      margin: "auto",
      position: "relative",
      fontFamily: "Inter, sans-serif"
    }}>


      {/* gradient glow */}

      <div style={{
        position: "absolute",
        width: "320px",
        height: "320px",
        background: "radial-gradient(circle,#5eead4,transparent 70%)",
        filter: "blur(60px)",
        top: "-80px",
        right: "-80px",
        opacity: .6
      }} />


      {/* main container */}

      <div style={{
        background: "white",
        borderRadius: "22px",
        padding: "26px",
        boxShadow: "0 40px 80px rgba(0,0,0,0.08)",
        border: "1px solid #eef2f7"
      }}>


        {/* header */}

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>

          <div style={{
            fontWeight: 700,
            fontSize: "14px"
          }}>
            AI Lead Discovery
          </div>

          <div style={{
            fontSize: "12px",
            color: "#10b981",
            fontWeight: 600
          }}>
            Live
          </div>

        </div>


        {/* search */}

        <div style={{
          background: "#f1f5f9",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#64748b"
        }}>
          "SaaS CTOs · Series B · US"
        </div>


        {/* lead cards */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px"
        }}>

          {leads.map((l, i) => (

            <div key={i}

              style={{
                borderRadius: "14px",
                padding: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}

            >

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px"
              }}>

                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: l.color,
                  opacity: .15
                }} />

                <div>

                  <div style={{ fontWeight: 600, fontSize: "13px" }}>
                    {l.name}
                  </div>

                  <div style={{
                    fontSize: "11px",
                    color: "#64748b"
                  }}>
                    {l.company}
                  </div>

                </div>

              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px"
              }}>

                <span style={{ color: "#64748b" }}>
                  {l.role}
                </span>

                <span style={{
                  color: l.color,
                  fontWeight: 700
                }}>
                  {l.score}%
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* stats */}

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px"
        }}>

          <Stat value="1248" label="Leads" />
          <Stat value="8.3s" label="Search" />
          <Stat value="96%" label="Accuracy" />

        </div>


      </div>


      {/* floating AI card */}

      <div style={{

        position: "absolute",
        top: "40px",
        right: "-40px",
        background: "white",
        padding: "16px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
        width: "160px"

      }}>

        <div style={{
          fontSize: "11px",
          fontWeight: 700,
          marginBottom: "8px"
        }}>
          AI Confidence
        </div>

        <Metric label="Email" value={96} />
        <Metric label="Role" value={91} />
        <Metric label="Intent" value={79} />

      </div>

    </div>

  )
}



function Stat({ value, label }: { value: string, label: string }) {

  return (

    <div style={{ textAlign: "center" }}>

      <div style={{
        fontWeight: 700,
        fontSize: "16px"
      }}>
        {value}
      </div>

      <div style={{
        fontSize: "11px",
        color: "#64748b"
      }}>
        {label}
      </div>

    </div>

  )

}


function Metric({ label, value }: { label: string, value: number }) {

  return (

    <div style={{ marginBottom: "6px" }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px"
      }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div style={{
        height: "4px",
        background: "#e2e8f0",
        borderRadius: "10px",
        marginTop: "3px"
      }}>

        <div style={{
          width: `${value}%`,
          background: "#10b981",
          height: "100%",
          borderRadius: "10px"
        }} />

      </div>

    </div>

  )

}
import { Link } from "react-router-dom";

function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "For therapists starting their private practice.",
      price: "₹499",
      period: "/month",
      features: [
        "Basic client management",
        "Scheduling",
        "Secure notes"
      ]
    },
    {
      name: "Professional",
      description: "For growing practices managing more clients.",
      price: "₹999",
      period: "/month",
      features: [
        "Everything in Starter",
        "Payments and packages",
        "Client communication"
      ],
      featured: true
    },
    {
      name: "Practice",
      description: "For established practices needing more tools.",
      price: "₹1,999",
      period: "/month",
      features: [
        "Everything in Professional",
        "Advanced analytics",
        "Higher client limits"
      ]
    }
  ];

  return (
    <section
      className="pricing-section"
      id="pricing"
    >

      <div className="pricing-heading">

        <span>
          FOR THERAPISTS
        </span>

        <h2>
          Simple plans for your practice
        </h2>

        <p>
          Choose the tools that fit the way you work.
        </p>

      </div>

      <div className="pricing-grid">

        {plans.map((plan) => (

          <article
            className={`pricing-card ${
              plan.featured ? "featured" : ""
            }`}
            key={plan.name}
          >

            {plan.featured && (
              <div className="popular-badge">
                Most popular
              </div>
            )}

            <h3>
              {plan.name}
            </h3>

            <p className="plan-description">
              {plan.description}
            </p>

            <div className="plan-price">
              {plan.price}
              <span>
                {plan.period}
              </span>
            </div>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="plan-button"
            >
              Get started
            </Link>

          </article>

        ))}

      </div>

    </section>
  );
}

export default Pricing;